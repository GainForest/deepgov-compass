
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import WeightSlider from "@/components/WeightSlider";
import { questions } from "@/data/questionsData";
import { useToast } from "@/components/ui/use-toast";

type AnswerType = "agree" | "disagree" | "neutral" | "no-answer";

interface UserAnswer {
  questionId: number;
  answer: AnswerType;
  weight: number;
}

const Questions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showWeighting, setShowWeighting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  // Handle answering a question
  const handleAnswer = (answer: AnswerType, weight: number) => {
    // Update or add the answer
    setUserAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          questionId: currentQuestion.id,
          answer,
          weight,
        };
        return newAnswers;
      } else {
        // Add new answer
        return [
          ...prev,
          {
            questionId: currentQuestion.id,
            answer,
            weight,
          },
        ];
      }
    });

    // Move to next question or show weighting if all questions answered
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowWeighting(true);
    }
  };

  // Handle going to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handle weight adjustment
  const handleWeightChange = (questionId: number, weight: number) => {
    setUserAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, weight }
          : answer
      )
    );
  };

  // Handle submitting results
  const handleSubmitResults = () => {
    // Filter out skipped questions (no-answer) before submitting
    const answeredQuestions = userAnswers.filter(
      (answer) => answer.answer !== "no-answer"
    );
    
    if (answeredQuestions.length > 0) {
      // Store user answers in session storage
      sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
      
      // Navigate to results page
      navigate("/results");
    } else {
      toast({
        title: "No answers provided",
        description: "Please answer at least one question before proceeding.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
      />
      
      <header className="pt-6 px-4">
        <div className="container max-w-4xl mx-auto">
          <ProgressBar
            currentStep={showWeighting ? questions.length : currentQuestionIndex + 1}
            totalSteps={questions.length}
          />
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!showWeighting ? (
            <motion.div
              key="question-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <QuestionCard
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                questionText={currentQuestion.text}
                onAnswer={handleAnswer}
                onPrevious={handlePrevious}
                isFirstQuestion={currentQuestionIndex === 0}
              />
            </motion.div>
          ) : (
            <motion.div
              key="weighting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-xl border-0 shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-medium mb-2">How Important Are These Issues?</h2>
                <p className="text-muted-foreground mb-6">
                  Adjust how much each issue matters to you. This helps us better match you with candidates.
                </p>
                
                <div className="space-y-4 mb-8">
                  {questions.map((question) => {
                    const userAnswer = userAnswers.find(
                      (a) => a.questionId === question.id
                    );
                    
                    // Only show weight sliders for questions the user has answered (not skipped)
                    return userAnswer && userAnswer.answer !== "no-answer" ? (
                      <WeightSlider
                        key={question.id}
                        questionId={question.id}
                        initialWeight={userAnswer.weight}
                        onWeightChange={handleWeightChange}
                        questionText={question.text}
                      />
                    ) : null;
                  })}
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowWeighting(false);
                      setCurrentQuestionIndex(questions.length - 1);
                    }}
                  >
                    Back to Questions
                  </Button>
                  
                  <Button
                    onClick={handleSubmitResults}
                    className="group shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      See Results
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Questions;
