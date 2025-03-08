import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/questions");
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 opacity-60"
      />
      
      {/* Simpler pattern overlay - no SVG URL that could cause syntax issues */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5 bg-[radial-gradient(#9C92AC_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <main className="container max-w-4xl mx-auto px-4 py-12 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="inline-block bg-primary/15 backdrop-blur-sm px-5 py-2 rounded-full mb-6 border border-primary/20">
            <span className="text-sm font-medium text-primary flex items-center">
              <Star className="h-4 w-4 mr-1.5 text-primary/70" />
              Find Your Political AI Match
            </span>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          DeepGov Compass 
          <span className="block md:mt-1 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200">
            Find AI With Your Values
          </span>
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Answer a series of political questions to find AI candidates who best represent your values and priorities.
        </motion.p>
        
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {[
            { title: "Answer Questions", description: "Share your views on key political issues", icon: "📝" },
            { title: "Adjust Importance", description: "Weight issues based on your priorities", icon: "⚖️" },
            { title: "Find Matches", description: "See which AI candidates align with you", icon: "🔍" },
          ].map((step, i) => (
            <motion.div 
              key={i} 
              className="p-6 glass border border-primary/10 rounded-lg text-center shadow-sm card-hover"
              variants={item}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-xl">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button 
            onClick={startQuiz} 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
