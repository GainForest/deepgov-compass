import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIModelMatchProps {
  name: string;
  approach: string;
  image: string;
  matchPercentage: number;
  learnMoreUrl: string;
  rank: number;
  onClick?: () => void;
}

const AIModelMatch = ({
  name,
  approach,
  image,
  matchPercentage,
  learnMoreUrl,
  rank,
  onClick,
}: AIModelMatchProps) => {
  // Determine color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 60) return "bg-emerald-400";
    if (percentage >= 40) return "bg-amber-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-rose-500";
  };

  const getMatchText = (percentage: number) => {
    if (percentage >= 80) return "Excellent Alignment";
    if (percentage >= 60) return "Good Alignment";
    if (percentage >= 40) return "Moderate Alignment";
    if (percentage >= 20) return "Poor Alignment";
    return "Very Poor Alignment";
  };

  // Handle opening the learn more URL without triggering the onClick event
  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    window.open(learnMoreUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      <Card className="overflow-hidden glass glass-hover border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 relative">
        <div className={`absolute top-0 left-0 right-0 h-1 ${getMatchColor(matchPercentage)} rounded-t-lg opacity-80`}></div>
        
        <div className="p-6 pt-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-sm">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{approach}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{getMatchText(matchPercentage)}</span>
              <span className="text-sm font-bold">{matchPercentage}%</span>
            </div>
            <Progress
              value={matchPercentage}
              className={`h-2.5 rounded-full ${getMatchColor(matchPercentage)}`}
            />
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/30">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClick}
              className="text-sm font-medium text-primary"
            >
              View Details
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLearnMoreClick}
              className="flex items-center gap-1.5 text-sm font-medium text-primary"
            >
              Learn More <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIModelMatch; 