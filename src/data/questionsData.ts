// Define question types and AI model interfaces
export interface Question {
  id: number;
  text: string;
  category: "economic" | "social" | "governance" | "technical";
}

export type FeatureImportance = "high" | "medium" | "low" | "none";

export interface AIModel {
  id: number;
  name: string;
  approach: string;
  image: string;
  featureImportance: { [key: number]: FeatureImportance };
}

// Questions about public goods funding priorities
export const questions: Question[] = [
  {
    id: 1,
    text: "Public goods should prioritize immediate community needs over long-term systemic change",
    category: "economic"
  },
  {
    id: 2,
    text: "Projects with measurable outcomes should be favored over those with difficult-to-quantify benefits",
    category: "technical"
  },
  {
    id: 3,
    text: "Funding decisions should consider geographic equity and underserved populations",
    category: "social"
  },
  {
    id: 4,
    text: "Innovation and experimental approaches should be prioritized over proven solutions",
    category: "technical"
  },
  {
    id: 5,
    text: "Projects with strong community governance should receive preference",
    category: "governance"
  },
  {
    id: 6,
    text: "Environmental sustainability should be a key factor in funding decisions",
    category: "social"
  },
  {
    id: 7,
    text: "Cost-effectiveness should be the primary criterion for funding allocation",
    category: "economic"
  },
  {
    id: 8,
    text: "Projects that benefit the greatest number of people should be prioritized",
    category: "social"
  },
  {
    id: 9,
    text: "Funding should support projects with sustainable revenue models",
    category: "economic"
  },
  {
    id: 10,
    text: "Community participation in decision-making should be required for funded projects",
    category: "governance"
  }
];

// AI models with different feature importance approaches
export const aiModels: AIModel[] = [
  {
    id: 1,
    name: "EquityMax",
    approach: "Equity-Centered Approach",
    image: "/models/equity-max.png",
    featureImportance: {
      1: "medium",
      2: "low",
      3: "high",
      4: "medium",
      5: "high",
      6: "medium",
      7: "low",
      8: "medium",
      9: "low",
      10: "high"
    }
  },
  {
    id: 2,
    name: "EfficientAlloc",
    approach: "Efficiency-Optimized Approach",
    image: "/models/efficient-alloc.png",
    featureImportance: {
      1: "medium",
      2: "high",
      3: "low",
      4: "medium",
      5: "low",
      6: "medium",
      7: "high",
      8: "high",
      9: "high",
      10: "low"
    }
  },
  {
    id: 3,
    name: "SustainFocus",
    approach: "Sustainability-Driven Approach",
    image: "/models/sustain-focus.png",
    featureImportance: {
      1: "low",
      2: "medium",
      3: "medium",
      4: "high",
      5: "medium",
      6: "high",
      7: "medium",
      8: "low",
      9: "high",
      10: "medium"
    }
  },
  {
    id: 4,
    name: "CommunityCentric",
    approach: "Community-Governed Approach",
    image: "/models/community-centric.png",
    featureImportance: {
      1: "high",
      2: "low",
      3: "high",
      4: "low",
      5: "high",
      6: "medium",
      7: "low",
      8: "medium",
      9: "medium",
      10: "high"
    }
  },
  {
    id: 5,
    name: "InnovationEngine",
    approach: "Innovation-Focused Approach",
    image: "/models/innovation-engine.png",
    featureImportance: {
      1: "low",
      2: "medium",
      3: "medium",
      4: "high",
      5: "medium",
      6: "medium",
      7: "medium",
      8: "medium",
      9: "medium",
      10: "low"
    }
  }
];
