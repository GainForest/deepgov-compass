
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { candidates, questions } from "@/data/questionsData";
import { Check, X, Minus, HelpCircle } from "lucide-react";

interface CandidateComparisonProps {
  userAnswers?: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" };
}

const CandidateComparison = ({ userAnswers }: CandidateComparisonProps) => {
  const [candidate1Id, setCandidate1Id] = useState<string>(candidates[0].id.toString());
  const [candidate2Id, setCandidate2Id] = useState<string>(candidates[1].id.toString());
  
  const candidate1 = candidates.find(c => c.id.toString() === candidate1Id);
  const candidate2 = candidates.find(c => c.id.toString() === candidate2Id);
  
  if (!candidate1 || !candidate2) return null;
  
  const getPositionIcon = (position: "agree" | "disagree" | "neutral" | "no-answer") => {
    switch (position) {
      case "agree": return <Check className="w-5 h-5 text-emerald-500" />;
      case "disagree": return <X className="w-5 h-5 text-rose-500" />;
      case "neutral": return <Minus className="w-5 h-5 text-amber-500" />;
      case "no-answer": return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };
  
  // Get color class for agreement/disagreement
  const getComparisonColor = (pos1: string, pos2: string) => {
    if (pos1 === pos2) return "bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500";
    if ((pos1 === "agree" && pos2 === "disagree") || (pos1 === "disagree" && pos2 === "agree")) {
      return "bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500";
    }
    return "bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium mb-1 block">Candidate 1</label>
            <Select value={candidate1Id} onValueChange={setCandidate1Id}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {candidates.map(candidate => (
                  <SelectItem key={candidate.id} value={candidate.id.toString()}>
                    {candidate.name} ({candidate.party})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Candidate 2</label>
            <Select value={candidate2Id} onValueChange={setCandidate2Id}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {candidates.map(candidate => (
                  <SelectItem key={candidate.id} value={candidate.id.toString()}>
                    {candidate.name} ({candidate.party})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          {questions.map(question => {
            const pos1 = candidate1.positions[question.id];
            const pos2 = candidate2.positions[question.id];
            const userPos = userAnswers?.[question.id];
            
            return (
              <div 
                key={question.id}
                className={`p-4 rounded-md ${getComparisonColor(pos1, pos2)}`}
              >
                <div className="text-sm font-medium mb-2">{question.text}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8">{getPositionIcon(pos1)}</div>
                    <div className="text-sm">{candidate1.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8">{getPositionIcon(pos2)}</div>
                    <div className="text-sm">{candidate2.name}</div>
                  </div>
                </div>
                
                {userPos && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-8">{getPositionIcon(userPos)}</div>
                      <div className="text-sm">Your position</div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default CandidateComparison;
