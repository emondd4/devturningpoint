export type InterviewLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface BankQuestion {
  id: string;
  level: InterviewLevel;
  category: string;
  topic: string;
  questionType: string;
  question: string;
}

export interface InterviewTrackCatalog {
  slug: string;
  label: string;
  prefix: string;
  count: number;
  byLevel: Record<InterviewLevel, number>;
  categories: string[];
}

export interface InterviewCatalog {
  title: string;
  generatedAt: string;
  methodology: {
    goal: string;
    levels: string[];
    notes: string[];
  };
  totalQuestions: number;
  tracks: InterviewTrackCatalog[];
}
