export type InterviewLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface BankQuestion {
  id: string;
  level: InterviewLevel;
  category: string;
  topic: string;
  questionType: string;
  question: string;
  /** One-line interview answer */
  shortAnswer?: string;
  /** Full spoken/written answer */
  answer?: string;
  /** Concrete code or worked example when useful */
  example?: string;
  /** How to apply or adopt this in a real project */
  integrationProcedure?: string;
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
