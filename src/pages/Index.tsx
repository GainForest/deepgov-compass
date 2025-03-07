
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/questions");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 opacity-50"
      />
      
      <main className="container max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-block bg-primary/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Find Your Political Match</span>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover Which Candidates Align With Your Views
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Answer a series of political questions to find candidates who best represent your values and priorities.
        </motion.p>
        
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { title: "Answer Questions", description: "Share your views on key political issues" },
            { title: "Adjust Importance", description: "Weight issues based on your priorities" },
            { title: "Find Matches", description: "See which candidates align with you" },
          ].map((step, i) => (
            <div 
              key={i} 
              className="p-6 glass border border-border/30 rounded-lg text-center shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            onClick={startQuiz}
            className="group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg bg-primary hover:bg-primary/90"
          >
            <span className="flex items-center gap-2">
              Start Questionnaire
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
