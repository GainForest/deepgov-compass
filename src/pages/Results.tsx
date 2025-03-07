
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import CandidateMatch from "@/components/CandidateMatch";
import { candidates, questions } from "@/data/questionsData";
import { useToast } from "@/components/ui/use-toast";

type AnswerType = "agree" | "disagree" | "neutral" | "no-answer";

interface UserAnswer {
  questionId: number;
  answer: AnswerType;
  weight: number;
}

interface CandidateResult {
  id: number;
  name: string;
  party: string;
  image: string;
  matchPercentage: number;
}

const Results = () => {
  const [matchResults, setMatchResults] = useState<CandidateResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve user answers from session storage
    const savedAnswers = sessionStorage.getItem("userAnswers");
    
    if (!savedAnswers) {
      // If no answers found, navigate back to questions
      navigate("/questions");
      return;
    }
    
    const userAnswers: UserAnswer[] = JSON.parse(savedAnswers);
    
    // Calculate match percentages
    const results = calculateMatches(userAnswers);
    
    // Sort by match percentage (descending)
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setMatchResults(results);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  // Calculate match percentages between user answers and candidates
  const calculateMatches = (userAnswers: UserAnswer[]): CandidateResult[] => {
    return candidates.map((candidate) => {
      let totalWeightedScore = 0;
      let totalPossibleScore = 0;

      // Calculate weighted score for each question
      userAnswers.forEach((userAnswer) => {
        const candidateAnswer = candidate.positions[userAnswer.questionId];
        const weight = userAnswer.weight;
        
        // Skip questions with "no-answer" from user
        if (userAnswer.answer === "no-answer") {
          return;
        }
        
        // Match scores based on answer combinations
        let score = 0;
        
        if (userAnswer.answer === candidateAnswer) {
          // Perfect match
          score = 1;
        } else if (
          (userAnswer.answer === "neutral" && candidateAnswer !== "no-answer") ||
          (candidateAnswer === "neutral" && userAnswer.answer !== "no-answer")
        ) {
          // Partial match with neutral
          score = 0.5;
        } else if (
          candidateAnswer === "no-answer" ||
          (userAnswer.answer === "agree" && candidateAnswer === "disagree") ||
          (userAnswer.answer === "disagree" && candidateAnswer === "agree")
        ) {
          // Complete mismatch
          score = 0;
        }
        
        // Apply weighting
        totalWeightedScore += score * weight;
        totalPossibleScore += weight;
      });

      // Calculate percentage match
      const matchPercentage = totalPossibleScore > 0
        ? Math.round((totalWeightedScore / totalPossibleScore) * 100)
        : 0;

      return {
        id: candidate.id,
        name: candidate.name,
        party: candidate.party,
        image: candidate.image,
        matchPercentage,
      };
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Candidate Matches",
        text: `My top candidate match is ${matchResults[0]?.name} with a ${matchResults[0]?.matchPercentage}% match!`,
        url: window.location.href,
      })
      .catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Results link copied to clipboard!",
      });
    }
  };

  const handleRestartQuiz = () => {
    // Clear saved answers
    sessionStorage.removeItem("userAnswers");
    navigate("/questions");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
      />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-block bg-primary/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">Your Results</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">Candidate Matches</h1>
          <p className="text-muted-foreground mb-8">
            Based on your answers, here are the candidates that best match your political views.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-muted-foreground">Calculating your matches...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchResults.map((result, index) => (
                <CandidateMatch
                  key={result.id}
                  name={result.name}
                  party={result.party}
                  image={result.image}
                  matchPercentage={result.matchPercentage}
                  rank={index}
                />
              ))}
            </div>
          </div>
        )}
        
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            variant="outline" 
            onClick={handleRestartQuiz}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Restart Quiz
          </Button>
          
          <Button 
            onClick={handleShare}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Results;
