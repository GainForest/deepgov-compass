import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { aiModels, questions } from "@/data/questionsData";
import { Check, X, Minus, HelpCircle } from "lucide-react";

interface FeatureImportanceComparisonProps {
  userAnswers?: { [key: number]: "high" | "medium" | "low" | "none" };
}

const FeatureImportanceComparison = ({ userAnswers }: FeatureImportanceComparisonProps) => {
  const [model1Id, setModel1Id] = useState<number>(1);
  const [model2Id, setModel2Id] = useState<number>(2);
  
  const model1 = aiModels.find(model => model.id === model1Id) || aiModels[0];
  const model2 = aiModels.find(model => model.id === model2Id) || aiModels[1];
  
  // Function to render icon based on importance
  const getImportanceIcon = (importance?: "high" | "medium" | "low" | "none") => {
    switch (importance) {
      case "high":
        return <Check className="h-5 w-5 text-emerald-500" />;
      case "medium":
        return <Minus className="h-5 w-5 text-amber-500" />;
      case "low":
        return <X className="h-5 w-5 rotate-45 text-orange-500" />;
      case "none":
        return <X className="h-5 w-5 text-rose-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Function to convert importance to text
  const getImportanceText = (importance?: "high" | "medium" | "low" | "none") => {
    switch (importance) {
      case "high": return "High Importance";
      case "medium": return "Medium Importance";
      case "low": return "Low Importance";
      case "none": return "Not Important";
      default: return "Unknown";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <Card className="p-6 backdrop-blur-md">
        <h3 className="text-xl font-medium mb-4">Compare Feature Importance</h3>
        <p className="text-muted-foreground mb-6">
          See how different AI models prioritize features compared to your preferences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium mb-2 block">First Model</label>
            <Select defaultValue={model1Id.toString()} onValueChange={(value) => setModel1Id(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.name} ({model.approach})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Second Model</label>
            <Select defaultValue={model2Id.toString()} onValueChange={(value) => setModel2Id(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.id} value={model.id.toString()}>
                    {model.name} ({model.approach})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          {questions.map(question => {
            const imp1 = model1.featureImportance[question.id];
            const imp2 = model2.featureImportance[question.id];
            const userImp = userAnswers?.[question.id];
            
            return (
              <div key={question.id} className="border rounded-lg p-4 transition-colors hover:bg-secondary/20">
                <div className="font-medium mb-3">{question.text}</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{model1.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8">{getImportanceIcon(imp1)}</div>
                      <div className="text-sm">{getImportanceText(imp1)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{model2.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-8">{getImportanceIcon(imp2)}</div>
                      <div className="text-sm">{getImportanceText(imp2)}</div>
                    </div>
                  </div>
                  
                  {userAnswers && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Your Preference</div>
                      <div className="flex items-center gap-2">
                        <div className="w-8">{getImportanceIcon(userImp)}</div>
                        <div className="text-sm">{getImportanceText(userImp)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default FeatureImportanceComparison; 