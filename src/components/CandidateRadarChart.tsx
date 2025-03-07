
import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { questions } from "@/data/questionsData";
import { motion } from "framer-motion";

interface CandidateRadarChartProps {
  candidateId: number;
  candidatePositions: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" };
  candidateName: string;
  candidateColor: string;
  userAnswers?: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" };
}

const CandidateRadarChart = ({
  candidateId,
  candidatePositions,
  candidateName,
  candidateColor,
  userAnswers
}: CandidateRadarChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Transform positions to radar chart format
    const transformedData = questions.map(question => {
      const candidateScore = getPositionScore(candidatePositions[question.id]);
      
      const data: any = {
        subject: getShortQuestionText(question.text),
        fullText: question.text,
        [candidateName]: candidateScore,
      };
      
      // Add user data if provided
      if (userAnswers) {
        data.User = getPositionScore(userAnswers[question.id]);
      }
      
      return data;
    });
    
    setChartData(transformedData);
  }, [candidateId, candidatePositions, candidateName, userAnswers]);

  // Convert position to numeric score for radar chart
  const getPositionScore = (position: "agree" | "disagree" | "neutral" | "no-answer" | undefined) => {
    switch (position) {
      case "agree": return 100;
      case "neutral": return 50;
      case "disagree": return 0;
      case "no-answer":
      default:
        return 25; // Default value for no-answer
    }
  };

  // Get shortened question text for radar chart labels
  const getShortQuestionText = (text: string) => {
    const words = text.split(" ");
    return words.length > 3 ? `${words.slice(0, 3).join(" ")}...` : text;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
    >
      <Card className="p-4 h-[500px]">
        <h3 className="text-lg font-medium mb-2 text-center">{candidateName}'s Position Profile</h3>
        <ResponsiveContainer width="100%" height="90%">
          <RadarChart outerRadius="70%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis domain={[0, 100]} />
            
            <Radar 
              name={candidateName}
              dataKey={candidateName}
              stroke={candidateColor} 
              fill={candidateColor} 
              fillOpacity={0.6} 
            />
            
            {userAnswers && (
              <Radar 
                name="Your Positions"
                dataKey="User"
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3} 
              />
            )}
            
            <Tooltip 
              formatter={(value, name, props) => [`${value}% (${value === 100 ? 'Agree' : value === 50 ? 'Neutral' : 'Disagree'})`, name]}
              labelFormatter={(label, data) => {
                return data[0]?.payload?.fullText || label;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
};

export default CandidateRadarChart;
