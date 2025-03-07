
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { candidates, questions } from "@/data/questionsData";

interface PoliticalCompassProps {
  userAnswers?: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" };
  onCandidateClick?: (candidateId: number) => void;
}

// Maps questions to economic and social dimensions
const questionDimensions = {
  // Economic (left-right): 1-5 (negative values are left, positive values are right)
  economic: {
    1: -1, // Public transportation (left)
    2: -1, // Universal healthcare (left)
    4: -1, // Free education (left)
    5: -1, // Minimum wage (left)
    7: -1, // Higher taxes (left)
  },
  // Social (libertarian-authoritarian): 6-10 (negative values are libertarian, positive values are authoritarian)
  social: {
    3: -1, // Environmental regulations (libertarian)
    6: 1,  // Gun control (authoritarian)
    8: -1, // Immigration (libertarian)
    9: -1, // Renewable energy (libertarian)
    10: -1, // Defense spending (authoritarian when high)
  }
};

const PoliticalCompass = ({ userAnswers, onCandidateClick }: PoliticalCompassProps) => {
  const [compassData, setCompassData] = useState<any[]>([]);
  
  useEffect(() => {
    // Calculate compass positions for all candidates and optionally user
    const data = candidates.map(candidate => {
      const { economicScore, socialScore } = calculatePosition(candidate.positions);
      return {
        x: economicScore,
        y: socialScore,
        z: 50, // Size for candidates
        name: candidate.name,
        party: candidate.party,
        id: candidate.id,
        color: getCandidateColor(candidate.party),
        type: 'candidate'
      };
    });
    
    // Add user data if provided
    if (userAnswers && Object.keys(userAnswers).length > 0) {
      const { economicScore, socialScore } = calculatePosition(userAnswers);
      data.push({
        x: economicScore,
        y: socialScore,
        z: 80, // Larger size for user
        name: 'You',
        party: 'Your Position',
        id: 0,
        color: '#8884d8',
        type: 'user'
      });
    }
    
    setCompassData(data);
  }, [userAnswers]);
  
  // Calculate economic and social scores based on positions
  const calculatePosition = (positions: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" }) => {
    let economicTotal = 0;
    let economicCount = 0;
    let socialTotal = 0;
    let socialCount = 0;
    
    Object.entries(positions).forEach(([questionIdStr, position]) => {
      const questionId = parseInt(questionIdStr);
      const value = getPositionValue(position);
      
      // Map to economic dimension
      if (questionDimensions.economic[questionId as keyof typeof questionDimensions.economic]) {
        economicTotal += value * questionDimensions.economic[questionId as keyof typeof questionDimensions.economic];
        economicCount++;
      }
      
      // Map to social dimension
      if (questionDimensions.social[questionId as keyof typeof questionDimensions.social]) {
        socialTotal += value * questionDimensions.social[questionId as keyof typeof questionDimensions.social];
        socialCount++;
      }
    });
    
    // Normalize scores to -5 to 5 scale
    const economicScore = economicCount > 0 ? (economicTotal / economicCount) * 5 : 0;
    const socialScore = socialCount > 0 ? (socialTotal / socialCount) * 5 : 0;
    
    return { economicScore, socialScore };
  };
  
  // Convert position to numeric value
  const getPositionValue = (position: "agree" | "disagree" | "neutral" | "no-answer") => {
    switch (position) {
      case "agree": return 1;
      case "neutral": return 0;
      case "disagree": return -1;
      case "no-answer": return 0;
      default: return 0;
    }
  };
  
  // Get color based on party
  const getCandidateColor = (party: string) => {
    switch (party) {
      case "Progressive Party": return "#3b82f6"; // Blue
      case "Moderate Alliance": return "#8b5cf6"; // Purple
      case "Traditional Values": return "#ef4444"; // Red
      default: return "#6b7280"; // Gray
    }
  };
  
  const handleClick = (data: any) => {
    if (data && data.type === 'candidate' && onCandidateClick) {
      onCandidateClick(data.id);
    }
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.party}</p>
          <p className="text-xs">
            Economic: {data.x > 0 ? "Right" : "Left"} ({data.x.toFixed(1)})
          </p>
          <p className="text-xs">
            Social: {data.y > 0 ? "Authoritarian" : "Libertarian"} ({data.y.toFixed(1)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
    >
      <Card className="p-4 h-[600px]">
        <h3 className="text-lg font-medium mb-2 text-center">Political Compass</h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Positions mapped on economic (left-right) and social (libertarian-authoritarian) axes
        </p>
        
        <ResponsiveContainer width="100%" height="85%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              domain={[-6, 6]} 
              label={{ value: 'Economic', position: 'bottom', offset: 0 }}
              tickFormatter={(value) => value === 0 ? "Center" : value < 0 ? "Left" : "Right"}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              domain={[-6, 6]} 
              label={{ value: 'Social', angle: -90, position: 'left' }}
              tickFormatter={(value) => value === 0 ? "Center" : value < 0 ? "Libertarian" : "Authoritarian"}
            />
            <ZAxis type="number" dataKey="z" range={[40, 160]} />
            <Tooltip content={<CustomTooltip />} />
            
            <Scatter 
              data={compassData} 
              onClick={handleClick}
            >
              {compassData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  cursor={entry.type === 'candidate' && onCandidateClick ? 'pointer' : 'default'}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};

export default PoliticalCompass;
