
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CheckCircle2, XCircle, HelpCircle, MinusCircle } from "lucide-react";

type AnswerType = "agree" | "disagree" | "neutral" | "no-answer";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  onAnswer: (answer: AnswerType, weight: number) => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
}

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  questionText,
  onAnswer,
  onPrevious,
  isFirstQuestion,
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType | null>(null);
  const [weight, setWeight] = useState<number>(1);

  const handleAnswerSelect = (answer: AnswerType) => {
    setSelectedAnswer(answer);
  };

  const handleWeightChange = (value: number[]) => {
    setWeight(value[0]);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer, weight);
    }
  };

  const answerOptions = [
    { value: "agree", icon: CheckCircle2, label: "Agree", color: "bg-emerald-500" },
    { value: "disagree", icon: XCircle, label: "Disagree", color: "bg-rose-500" },
    { value: "neutral", icon: MinusCircle, label: "Neutral", color: "bg-amber-500" },
    { value: "no-answer", icon: HelpCircle, label: "No Answer", color: "bg-slate-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-md border-0 shadow-lg rounded-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
        
        <h2 className="text-2xl font-medium mb-8">{questionText}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {answerOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.value}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                  selectedAnswer === option.value
                    ? `ring-2 ring-primary shadow-md scale-[1.02]`
                    : "hover:bg-secondary/80 cursor-pointer"
                }`}
                onClick={() => handleAnswerSelect(option.value as AnswerType)}
              >
                <div className="p-4 flex flex-col items-center gap-2 text-center">
                  <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{option.label}</span>
                </div>
                
                {selectedAnswer === option.value && (
                  <motion.div
                    className="absolute inset-0 bg-primary/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        {selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="mb-3">
              <h3 className="text-lg font-medium mb-2">How important is this issue to you?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag the slider to indicate how much weight this question should have in determining your matches.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-sm">Less</span>
              <Slider
                value={[weight]}
                min={1}
                max={5}
                step={1}
                onValueChange={handleWeightChange}
                className="flex-1"
              />
              <span className="text-sm">More</span>
            </div>
            
            <div className="text-center mt-2 text-sm text-muted-foreground">
              Importance: {weight === 1 ? "Very Low" : weight === 2 ? "Low" : weight === 3 ? "Medium" : weight === 4 ? "High" : "Very High"}
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className="transition-all duration-200"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`transition-all duration-300 ${
              !selectedAnswer ? "opacity-50" : "shadow-md hover:shadow-lg"
            }`}
          >
            Next
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
