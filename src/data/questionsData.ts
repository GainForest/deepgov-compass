
export interface Question {
  id: number;
  text: string;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  image: string;
  positions: { [key: number]: "agree" | "disagree" | "neutral" | "no-answer" };
}

export const questions: Question[] = [
  {
    id: 1,
    text: "The government should increase funding for public transportation."
  },
  {
    id: 2,
    text: "Healthcare should be provided as a universal right to all citizens."
  },
  {
    id: 3,
    text: "Environmental regulations should be strengthened to combat climate change."
  },
  {
    id: 4,
    text: "Higher education should be free or heavily subsidized by the government."
  },
  {
    id: 5,
    text: "The minimum wage should be increased to provide a living wage."
  },
  {
    id: 6,
    text: "Gun ownership should be more strictly regulated."
  },
  {
    id: 7,
    text: "Income taxes should be increased for the highest income brackets."
  },
  {
    id: 8,
    text: "Immigration policies should be more welcoming to asylum seekers."
  },
  {
    id: 9,
    text: "The government should invest more in renewable energy."
  },
  {
    id: 10,
    text: "Defense spending should be reduced to fund social programs."
  }
];

export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Alexandra Wilson",
    party: "Progressive Party",
    image: "https://i.pravatar.cc/150?img=1",
    positions: {
      1: "agree",
      2: "agree",
      3: "agree",
      4: "agree",
      5: "agree",
      6: "agree",
      7: "agree",
      8: "agree",
      9: "agree",
      10: "agree"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    party: "Progressive Party",
    image: "https://i.pravatar.cc/150?img=3",
    positions: {
      1: "agree",
      2: "agree",
      3: "agree",
      4: "agree",
      5: "neutral",
      6: "agree",
      7: "agree",
      8: "agree",
      9: "agree",
      10: "neutral"
    }
  },
  {
    id: 3,
    name: "Robert Taylor",
    party: "Moderate Alliance",
    image: "https://i.pravatar.cc/150?img=11",
    positions: {
      1: "neutral",
      2: "neutral",
      3: "agree",
      4: "neutral",
      5: "neutral",
      6: "neutral",
      7: "disagree",
      8: "neutral",
      9: "agree",
      10: "neutral"
    }
  },
  {
    id: 4,
    name: "Jessica Parker",
    party: "Moderate Alliance",
    image: "https://i.pravatar.cc/150?img=5",
    positions: {
      1: "neutral",
      2: "agree",
      3: "agree",
      4: "disagree",
      5: "neutral",
      6: "disagree",
      7: "disagree",
      8: "neutral",
      9: "agree",
      10: "disagree"
    }
  },
  {
    id: 5,
    name: "William Johnson",
    party: "Traditional Values",
    image: "https://i.pravatar.cc/150?img=7",
    positions: {
      1: "disagree",
      2: "disagree",
      3: "neutral",
      4: "disagree",
      5: "disagree",
      6: "disagree",
      7: "disagree",
      8: "disagree",
      9: "neutral",
      10: "disagree"
    }
  },
  {
    id: 6,
    name: "Lisa Rodriguez",
    party: "Traditional Values",
    image: "https://i.pravatar.cc/150?img=9",
    positions: {
      1: "disagree",
      2: "disagree",
      3: "disagree",
      4: "disagree",
      5: "disagree",
      6: "disagree",
      7: "disagree",
      8: "disagree",
      9: "disagree",
      10: "disagree"
    }
  }
];
