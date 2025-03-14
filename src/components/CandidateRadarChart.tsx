import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
  userAnswers,
}: CandidateRadarChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Transform the data for the radar chart
    const transformedData = questions.map((question) => {
      // Convert positions to numerical values: agree = 1, neutral = 0.5, disagree = 0, no-answer = 0
      const getValueFromPosition = (position: string | undefined) => {
        if (!position || position === "no-answer") return 0;
        if (position === "agree") return 1;
        if (position === "neutral") return 0.5;
        return 0; // disagree
      };
      
      const candidateValue = getValueFromPosition(candidatePositions[question.id]);
      
      // Only include user value if it exists
      const userValue = userAnswers ? getValueFromPosition(userAnswers[question.id]) : undefined;
      
      // Return data point for this question
      return {
        subject: question.text.length > 30 
          ? question.text.substring(0, 30) + "..." 
          : question.text,
        candidate: candidateValue,
        user: userValue,
        fullMark: 1,
      };
    });
    
    setChartData(transformedData);
  }, [candidateId, candidatePositions, userAnswers]);

  // Debug output - uncomment to see if data is being generated
  console.log("Chart data:", chartData);
  console.log("Candidate positions:", candidatePositions);
  console.log("User answers:", userAnswers);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
    >
      <Card className="w-full h-full p-4 overflow-hidden">
        <h3 className="text-lg font-medium mb-4">{candidateName}'s Political Positions</h3>
        
        {/* Explicitly set height and width */}
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#888" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
              
              <Radar
                name={candidateName}
                dataKey="candidate"
                stroke={candidateColor}
                fill={candidateColor}
                fillOpacity={0.5}
              />
              
              {userAnswers && (
                <Radar
                  name="Your Positions"
                  dataKey="user"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
              )}
              
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default CandidateRadarChart;
