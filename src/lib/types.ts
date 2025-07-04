import type { Timestamp } from "firebase/firestore";
import type { AnalyzeBabyStateOutput } from "@/ai/flows/analyze-baby-state";

export type Insight = {
  insight: string;
  recommendation: string;
};

export type CommunityPost = {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
};

export type AnalysisRecord = {
  id: string;
  createdAt: Timestamp;
  imageUrl: string;
  analysis: AnalyzeBabyStateOutput;
}
