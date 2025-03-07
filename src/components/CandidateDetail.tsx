import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CandidateRadarChart from "@/components/CandidateRadarChart";
import { candidates } from "@/data/questionsData";

interface CandidateDetailProps {
  candidateId: number;
  onClose: () => void;
  userAnswers?: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" };
}

const CandidateDetail = ({ candidateId, onClose, userAnswers }: CandidateDetailProps) => {
  const [activeTab, setActiveTab] = useState<"bio" | "positions">("bio");
  
  const candidate = candidates.find(c => c.id === candidateId);
  
  if (!candidate) return null;
  
  // Get color based on party
  const getCandidateColor = () => {
    switch (candidate.party) {
      case "Progressive Party": return "#3b82f6"; // Blue
      case "Moderate Alliance": return "#8b5cf6"; // Purple
      case "Traditional Values": return "#ef4444"; // Red
      default: return "#6b7280"; // Gray
    }
  };
  
  // Mock biography data (in a real app, this would come from the backend)
  const getBiography = () => {
    return {
      age: 35 + candidateId,
      education: candidate.party === "Progressive Party" 
        ? "PhD in Political Science" 
        : candidate.party === "Moderate Alliance"
        ? "Master's in Public Policy"
        : "Bachelor's in Economics",
      experience: candidate.party === "Progressive Party"
        ? "State Senator (2018-Present), City Council (2014-2018)"
        : candidate.party === "Moderate Alliance"
        ? "Mayor (2016-Present), Business Owner"
        : "State Representative (2012-Present), Corporate Executive",
      keyIssues: candidate.party === "Progressive Party"
        ? ["Healthcare Reform", "Climate Action", "Education Funding", "Income Inequality"]
        : candidate.party === "Moderate Alliance"
        ? ["Economic Growth", "Infrastructure", "Healthcare Access", "Bipartisanship"]
        : ["Tax Reduction", "National Security", "Traditional Values", "Limited Government"],
      bio: `${candidate.name} is a dedicated public servant with a strong record of ${
        candidate.party === "Progressive Party" 
          ? "advocating for social justice and environmental protection" 
          : candidate.party === "Moderate Alliance"
          ? "building consensus and practical solutions"
          : "defending traditional values and economic freedom"
      }. Throughout their career, they have focused on ${
        candidate.party === "Progressive Party"
          ? "expanding access to healthcare and education while fighting climate change"
          : candidate.party === "Moderate Alliance"
          ? "creating jobs and improving infrastructure while finding common ground"
          : "supporting families and businesses while ensuring strong national security"
      }.`
    };
  };
  
  const biography = getBiography();
  
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
              background: `linear-gradient(135deg, ${getCandidateColor()}20, ${getCandidateColor()}50)`, 
              borderBottom: `1px solid ${getCandidateColor()}30` 
            }}
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2" style={{ borderColor: getCandidateColor() }}>
                <AvatarImage src={candidate.image} alt={candidate.name} />
                <AvatarFallback>{candidate.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-sm text-muted-foreground">{candidate.party}</p>
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
                activeTab === "bio" 
                  ? `border-b-2 text-primary` 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderColor: activeTab === "bio" ? getCandidateColor() : "transparent" }}
              onClick={() => setActiveTab("bio")}
            >
              Biography
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm flex-1 transition-colors ${
                activeTab === "positions" 
                  ? `border-b-2 text-primary` 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderColor: activeTab === "positions" ? getCandidateColor() : "transparent" }}
              onClick={() => setActiveTab("positions")}
            >
              Positions
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-170px)]">
            {activeTab === "bio" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
                      <p>{biography.age}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Education</h3>
                      <p>{biography.education}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Experience</h3>
                      <p>{biography.experience}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Key Issues</h3>
                    <ul className="space-y-1">
                      {biography.keyIssues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: getCandidateColor() }}
                          />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Biography</h3>
                  <p className="text-sm leading-relaxed">{biography.bio}</p>
                </div>
              </div>
            ) : (
              <div className="h-[400px]">
                <CandidateRadarChart
                  candidateId={candidate.id}
                  candidateName={candidate.name}
                  candidatePositions={candidate.positions}
                  candidateColor={getCandidateColor()}
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

export default CandidateDetail;
