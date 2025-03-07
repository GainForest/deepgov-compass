
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CandidateMatchProps {
  name: string;
  party: string;
  image: string;
  matchPercentage: number;
  rank: number;
  onClick?: () => void;
}

const CandidateMatch = ({
  name,
  party,
  image,
  matchPercentage,
  rank,
  onClick,
}: CandidateMatchProps) => {
  // Determine color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-emerald-400";
    if (percentage >= 40) return "bg-amber-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-rose-500";
  };

  const getMatchText = (percentage: number) => {
    if (percentage >= 80) return "Excellent Match";
    if (percentage >= 60) return "Good Match";
    if (percentage >= 40) return "Moderate Match";
    if (percentage >= 20) return "Poor Match";
    return "Very Poor Match";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      <Card className="overflow-hidden glass glass-hover border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{party}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{getMatchText(matchPercentage)}</span>
              <span className="text-sm font-bold">{matchPercentage}%</span>
            </div>
            <Progress
              value={matchPercentage}
              className={`h-2 ${getMatchColor(matchPercentage)}`}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CandidateMatch;
