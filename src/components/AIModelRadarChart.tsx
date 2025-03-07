import { useState, useEffect } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { questions } from "@/data/questionsData";
import { motion } from "framer-motion";

interface AIModelRadarChartProps {
  modelId: number;
  modelFeatures: { [key: number]: "high" | "medium" | "low" | "none" };
  modelName: string;
  modelColor: string;
  userAnswers?: { [key: number]: "high" | "medium" | "low" | "none" };
}

const AIModelRadarChart = ({
  modelId,
  modelFeatures,
  modelName,
  modelColor,
  userAnswers,
}: AIModelRadarChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    // Transform the data for the radar chart
    const transformedData = questions.map((question) => {
      // Convert importance to numerical values: high = 1, medium = 0.66, low = 0.33, none = 0
      const getValueFromImportance = (importance: string | undefined) => {
        if (!importance || importance === "none") return 0;
        if (importance === "high") return 1;
        if (importance === "medium") return 0.66;
        return 0.33; // low
      };
      
      const modelValue = getValueFromImportance(modelFeatures[question.id]);
      
      // Only include user value if it exists
      const userValue = userAnswers ? getValueFromImportance(userAnswers[question.id]) : undefined;
      
      // Return data point for this question
      return {
        subject: question.text.length > 30 
          ? question.text.substring(0, 30) + "..." 
          : question.text,
        model: modelValue,
        user: userValue,
        fullMark: 1,
        category: question.category
      };
    });
    
    setChartData(transformedData);
  }, [modelId, modelFeatures, userAnswers]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full"
    >
      <Card className="w-full h-full p-4 overflow-hidden">
        <h3 className="text-lg font-medium mb-4">{modelName}'s Feature Importance</h3>
        
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#888" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
              
              <Radar
                name={modelName}
                dataKey="model"
                stroke={modelColor}
                fill={modelColor}
                fillOpacity={0.5}
              />
              
              {userAnswers && (
                <Radar
                  name="Your Preferences"
                  dataKey="user"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.5}
                />
              )}
              
              <Legend />
              <Tooltip formatter={(value) => {
                const numValue = Number(value);
                if (numValue >= 0.9) return "High Importance";
                if (numValue >= 0.5) return "Medium Importance";
                if (numValue >= 0.2) return "Low Importance";
                return "Not Important";
              }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIModelRadarChart; 