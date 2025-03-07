
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

interface WeightSliderProps {
  questionId: number;
  initialWeight: number;
  onWeightChange: (questionId: number, weight: number) => void;
  questionText: string;
}

const WeightSlider = ({
  questionId,
  initialWeight,
  onWeightChange,
  questionText,
}: WeightSliderProps) => {
  const [weight, setWeight] = useState(initialWeight);

  const handleWeightChange = (values: number[]) => {
    const newWeight = values[0];
    setWeight(newWeight);
    onWeightChange(questionId, newWeight);
  };

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
        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-muted-foreground w-10">Less</span>
          <Slider
            value={[weight]}
            min={1}
            max={5}
            step={1}
            onValueChange={handleWeightChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">More</span>
        </div>
        <div className="text-right mt-1">
          <span className="text-xs text-muted-foreground">
            Importance: {
              weight === 1 ? "Very Low" : 
              weight === 2 ? "Low" : 
              weight === 3 ? "Medium" : 
              weight === 4 ? "High" : 
              "Very High"
            }
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeightSlider;
