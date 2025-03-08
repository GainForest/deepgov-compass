import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WeightMultiplierProps {
  questionId: number;
  initialWeight: number;
  onWeightChange: (questionId: number, weight: number) => void;
  questionText: string;
}

const WeightMultiplier = ({
  questionId,
  initialWeight,
  onWeightChange,
  questionText,
}: WeightMultiplierProps) => {
  const [weight, setWeight] = useState(initialWeight);

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight);
    onWeightChange(questionId, newWeight);
  };

  // Multiplier options
  const multipliers = [
    { value: 1, label: "1×", description: "Low Priority" },
    { value: 2, label: "2×", description: "Medium Priority" },
    { value: 3, label: "3×", description: "High Priority" },
    { value: 5, label: "5×", description: "Very High Priority" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Card className="p-4 glass border-border/30">
        <div className="text-sm font-medium mb-2">
          {questionText.length > 80
            ? `${questionText.substring(0, 80)}...`
            : questionText}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {multipliers.map((multiplier) => (
            <Button
              key={multiplier.value}
              variant={weight === multiplier.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleWeightChange(multiplier.value)}
              className="flex-grow"
            >
              <span className="font-bold mr-1">{multiplier.label}</span>
              <span className="text-xs">{multiplier.description}</span>
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default WeightMultiplier; 