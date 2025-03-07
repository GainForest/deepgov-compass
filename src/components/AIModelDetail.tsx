import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AIModelRadarChart from "@/components/AIModelRadarChart";
import { aiModels } from "@/data/questionsData";

interface AIModelDetailProps {
  modelId: number;
  onClose: () => void;
  userAnswers?: { [key: number]: FeatureImportance };
}

const AIModelDetail = ({ modelId, onClose, userAnswers }: AIModelDetailProps) => {
  const [activeTab, setActiveTab] = useState<"methodology" | "features">("methodology");
  
  const model = aiModels.find(m => m.id === modelId);
  
  if (!model) return null;
  
  // Get color based on approach
  const getModelColor = () => {
    switch (model.approach) {
      case "Equity-Centered Approach": return "#3b82f6"; // Blue
      case "Efficiency-Optimized Approach": return "#ef4444"; // Red
      case "Sustainability-Driven Approach": return "#10b981"; // Green
      case "Community-Governed Approach": return "#8b5cf6"; // Purple
      case "Innovation-Focused Approach": return "#f59e0b"; // Amber
      default: return "#6b7280"; // Gray
    }
  };
  
  // AI model methodology data
  const getMethodology = () => {
    return {
      datePublished: "2023",
      architecture: model.approach === "Equity-Centered Approach" 
        ? "Transformer-based with equity-weighted attention" 
        : model.approach === "Efficiency-Optimized Approach"
        ? "Optimized resource allocation neural network"
        : "Multi-criteria decision analysis framework",
      trainingData: model.approach === "Equity-Centered Approach"
        ? "Historic funding decisions with equity outcome analysis"
        : model.approach === "Efficiency-Optimized Approach"
        ? "Cost-benefit analysis of 10,000+ public goods projects"
        : "Mixed methods dataset with sustainability metrics",
      keyFeatures: model.approach === "Equity-Centered Approach"
        ? ["Population Impact Analysis", "Geographic Equity Weighting", "Underserved Population Targeting", "Community Input Interpreter"]
        : model.approach === "Efficiency-Optimized Approach"
        ? ["ROI Calculator", "Resource Optimization", "Scalability Predictor", "Cost-Benefit Analyzer"]
        : ["Sustainability Metrics", "Long-term Impact Projection", "Governance Structure Analysis", "Community Participation Scorer"],
      methodology: `${model.name} employs a sophisticated ${
        model.approach === "Equity-Centered Approach" 
          ? "equity-focused methodology that prioritizes fair distribution of resources" 
          : model.approach === "Efficiency-Optimized Approach"
          ? "efficiency-driven approach that maximizes return on investment"
          : "balanced framework that considers multiple stakeholder perspectives"
      }. The model evaluates funding decisions based on ${
        model.approach === "Equity-Centered Approach"
          ? "impact on underserved communities and equitable access"
          : model.approach === "Efficiency-Optimized Approach"
          ? "cost-effectiveness, scalability and measurable outcomes"
          : "sustainability, long-term viability and community governance"
      }.`
    };
  };
  
  const methodology = getMethodology();
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="p-6 flex items-center justify-between"
            style={{ 
              background: `linear-gradient(135deg, ${getModelColor()}20, ${getModelColor()}50)`, 
              borderBottom: `1px solid ${getModelColor()}30` 
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2" style={{ borderColor: getModelColor() }}>
                <AvatarImage src={model.image} alt={model.name} />
                <AvatarFallback>{model.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{model.name}</h2>
                <p className="text-sm text-muted-foreground">{model.approach}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium text-sm flex-1 transition-colors ${
                activeTab === "methodology" 
                  ? `border-b-2 text-primary` 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderColor: activeTab === "methodology" ? getModelColor() : "transparent" }}
              onClick={() => setActiveTab("methodology")}
            >
              Methodology
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm flex-1 transition-colors ${
                activeTab === "features" 
                  ? `border-b-2 text-primary` 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderColor: activeTab === "features" ? getModelColor() : "transparent" }}
              onClick={() => setActiveTab("features")}
            >
              Feature Importance
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-170px)]">
            {activeTab === "methodology" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
                      <p>{methodology.datePublished}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Architecture</h3>
                      <p>{methodology.architecture}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Training Data</h3>
                      <p>{methodology.trainingData}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Features</h3>
                    <ul className="space-y-1">
                      {methodology.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: getModelColor() }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Methodology</h3>
                  <p className="text-sm leading-relaxed">{methodology.methodology}</p>
                </div>
              </div>
            ) : (
              <div className="h-[400px]">
                <AIModelRadarChart
                  modelId={model.id}
                  modelName={model.name}
                  modelFeatures={model.featureImportance}
                  modelColor={getModelColor()}
                  userAnswers={userAnswers}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIModelDetail; 