
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Share2, BarChart3, LineChart, Users } from "lucide-react";
import CandidateMatch from "@/components/CandidateMatch";
import CandidateRadarChart from "@/components/CandidateRadarChart";
import PoliticalCompass from "@/components/PoliticalCompass";
import CandidateComparison from "@/components/CandidateComparison";
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
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [userAnswerMap, setUserAnswerMap] = useState<{[key: number]: AnswerType}>({});
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
    
    // Create a simple map of questionId to answer for visualizations
    const answerMap: {[key: number]: AnswerType} = {};
    userAnswers.forEach(answer => {
      answerMap[answer.questionId] = answer.answer;
    });
    setUserAnswerMap(answerMap);
    
    // Calculate match percentages
    const results = calculateMatches(userAnswers);
    
    // Sort by match percentage (descending)
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Set the first candidate as selected for radar chart
    if (results.length > 0) {
      setSelectedCandidate(results[0].id);
    }
    
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

  const handleCandidateSelect = (candidateId: number) => {
    setSelectedCandidate(candidateId);
  };

  // Get color for selected candidate
  const getSelectedCandidateColor = () => {
    const candidate = candidates.find(c => c.id === selectedCandidate);
    if (!candidate) return "#3b82f6"; // Default blue
    
    switch (candidate.party) {
      case "Progressive Party": return "#3b82f6"; // Blue
      case "Moderate Alliance": return "#8b5cf6"; // Purple
      case "Traditional Values": return "#ef4444"; // Red
      default: return "#6b7280"; // Gray
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
      />
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
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
          <Tabs defaultValue="matches" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
              <TabsTrigger value="matches" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Matches</span>
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-1">
                <LineChart className="w-4 h-4" />
                <span className="hidden sm:inline">Positions</span>
              </TabsTrigger>
              <TabsTrigger value="compass" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Compass</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Matches Tab */}
            <TabsContent value="matches" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchResults.map((result, index) => (
                  <CandidateMatch
                    key={result.id}
                    name={result.name}
                    party={result.party}
                    image={result.image}
                    matchPercentage={result.matchPercentage}
                    rank={index}
                    onClick={() => handleCandidateSelect(result.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Radar Chart Tab */}
            <TabsContent value="radar" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Select Candidate</h3>
                    <div className="space-y-3">
                      {candidates.map((candidate) => {
                        const isSelected = candidate.id === selectedCandidate;
                        return (
                          <div
                            key={candidate.id}
                            onClick={() => handleCandidateSelect(candidate.id)}
                            className={`p-3 rounded-md cursor-pointer transition-colors flex items-center gap-3
                              ${isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'}`}
                          >
                            <img 
                              src={candidate.image} 
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-xs text-muted-foreground">{candidate.party}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedCandidate && (
                    <CandidateRadarChart
                      candidateId={selectedCandidate}
                      candidateName={candidates.find(c => c.id === selectedCandidate)?.name || ""}
                      candidatePositions={candidates.find(c => c.id === selectedCandidate)?.positions || {}}
                      candidateColor={getSelectedCandidateColor()}
                      userAnswers={userAnswerMap}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Political Compass Tab */}
            <TabsContent value="compass" className="mt-6">
              <PoliticalCompass 
                userAnswers={userAnswerMap}
                onCandidateClick={handleCandidateSelect}
              />
            </TabsContent>
            
            {/* Compare Tab */}
            <TabsContent value="compare" className="mt-6">
              <CandidateComparison userAnswers={userAnswerMap} />
            </TabsContent>
          </Tabs>
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
