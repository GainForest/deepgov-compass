import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Share2, BarChart3, LineChart, Users } from "lucide-react";
import AIModelMatch from "@/components/AIModelMatch";
import AIModelRadarChart from "@/components/AIModelRadarChart";
import FeatureImportanceComparison from "@/components/FeatureImportanceComparison";
import AIModelDetail from "@/components/AIModelDetail";
import { aiModels, questions } from "@/data/questionsData";
import { useToast } from "@/components/ui/use-toast";

type FeatureImportance = "high" | "medium" | "low" | "none";

interface UserAnswer {
  questionId: number;
  answer: FeatureImportance;
  weight: number;
}

interface AIModelResult {
  id: number;
  name: string;
  approach: string;
  image: string;
  matchPercentage: number;
}

const Results = () => {
  const [matchResults, setMatchResults] = useState<AIModelResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [userAnswerMap, setUserAnswerMap] = useState<{[key: number]: FeatureImportance}>({});
  const [showModelDetail, setShowModelDetail] = useState(false);
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
    const answerMap: {[key: number]: FeatureImportance} = {};
    userAnswers.forEach(answer => {
      answerMap[answer.questionId] = answer.answer;
    });
    setUserAnswerMap(answerMap);
    
    // Calculate match percentages
    const results = calculateMatches(userAnswers);
    
    // Sort by match percentage (descending)
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Set the first AI model as selected for radar chart
    if (results.length > 0) {
      setSelectedModel(results[0].id);
    }
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setMatchResults(results);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  // Calculate match percentages between user answers and AI models
  const calculateMatches = (userAnswers: UserAnswer[]): AIModelResult[] => {
    return aiModels.map((model) => {
      let totalWeightedScore = 0;
      let totalPossibleScore = 0;

      // Calculate weighted score for each question
      userAnswers.forEach((userAnswer) => {
        const modelImportance = model.featureImportance[userAnswer.questionId];
        const weight = userAnswer.weight;
        
        // Skip questions with "none" from user
        if (userAnswer.answer === "none") {
          return;
        }
        
        // Match scores based on importance combinations
        let score = 0;
        
        if (userAnswer.answer === modelImportance) {
          // Perfect match
          score = 1;
        } else if (
          (userAnswer.answer === "medium" && modelImportance !== "none") ||
          (modelImportance === "medium" && userAnswer.answer !== "none")
        ) {
          // Partial match with medium
          score = 0.5;
        } else if (
          (modelImportance === "none") ||
          (userAnswer.answer === "high" && modelImportance === "low") ||
          (userAnswer.answer === "low" && modelImportance === "high")
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
        id: model.id,
        name: model.name,
        approach: model.approach,
        image: model.image,
        matchPercentage,
      };
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My AI Model Matches",
        text: `My top AI model match is ${matchResults[0]?.name} with a ${matchResults[0]?.matchPercentage}% alignment!`,
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
    navigate("/questions");
  };

  const handleModelSelect = (modelId: number) => {
    setSelectedModel(modelId);
    setShowModelDetail(true);
  };

  const handleCloseDetail = () => {
    setShowModelDetail(false);
  };

  // Get color for selected AI model
  const getSelectedModelColor = () => {
    const model = aiModels.find(c => c.id === selectedModel);
    if (!model) return "#6b7280"; // Default gray
    
    switch (model.approach) {
      case "Equity-Centered Approach": return "#3b82f6"; // Blue
      case "Efficiency-Optimized Approach": return "#ef4444"; // Red
      case "Sustainability-Driven Approach": return "#10b981"; // Green
      case "Community-Governed Approach": return "#8b5cf6"; // Purple
      case "Innovation-Focused Approach": return "#f59e0b"; // Amber
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
      
      {showModelDetail && selectedModel && (
        <AIModelDetail
          modelId={selectedModel}
          onClose={handleCloseDetail}
          userAnswers={userAnswerMap}
        />
      )}
      
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-block bg-primary/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <span className="text-sm font-medium text-primary">Your Results</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">AI Model Alignment</h1>
          <p className="text-muted-foreground mb-8">
            Based on your feature importance preferences, here are the AI models that best align with your public goods funding priorities.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
            <p className="text-muted-foreground">Calculating your matches...</p>
          </div>
        ) : (
          <Tabs defaultValue="matches" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="matches" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Matches</span>
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-1">
                <LineChart className="w-4 h-4" />
                <span className="hidden sm:inline">Features</span>
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
                  <AIModelMatch
                    key={result.id}
                    name={result.name}
                    approach={result.approach}
                    image={result.image}
                    matchPercentage={result.matchPercentage}
                    rank={index}
                    onClick={() => handleModelSelect(result.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Radar Chart Tab */}
            <TabsContent value="radar" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Select AI Model</h3>
                    <div className="space-y-3">
                      {aiModels.map((model) => {
                        const isSelected = model.id === selectedModel;
                        return (
                          <div
                            key={model.id}
                            onClick={() => handleModelSelect(model.id)}
                            className={`p-3 rounded-md cursor-pointer transition-colors flex items-center gap-3
                              ${isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary/50'}`}
                          >
                            <img 
                              src={model.image} 
                              alt={model.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-muted-foreground">{model.approach}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {selectedModel && (
                    <AIModelRadarChart
                      modelId={selectedModel}
                      modelName={aiModels.find(m => m.id === selectedModel)?.name || ""}
                      modelFeatures={aiModels.find(m => m.id === selectedModel)?.featureImportance || {}}
                      modelColor={getSelectedModelColor()}
                      userAnswers={userAnswerMap}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Compare Tab */}
            <TabsContent value="compare" className="mt-6">
              <FeatureImportanceComparison userAnswers={userAnswerMap} />
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
            Restart Assessment
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
