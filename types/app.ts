// types/app.ts

export type Feeling =
  | "anxious"
  | "nervous"
  | "overwhelmed"
  | "unfocused"
  | "tired"
  | "unmotivated"
  | "stuck"
  | "stressed";

export type Intensity = 1 | 2 | 3 | 4 | 5;

export type InterventionType =
  | "physiological"
  | "grounding"
  | "cognitive"
  | "behavioral"
  | "environmental";

export type Intervention = {
  id: string;
  feeling: Feeling;
  type: InterventionType;
  title: string;
  instruction: string;
  durationSeconds: number;
  hasTimer: boolean;
  sortOrder: number;
};

export type FeedbackValue = "worked" | "a_little" | "didnt_help";

export const feedbackScoreMap = {
  worked: 2,
  a_little: 1,
  didnt_help: -1,
} as const;

export type InterventionStats = {
  interventionId: string;
  shownCount: number;
  workedCount: number;
  aLittleCount: number;
  didntHelpCount: number;
  totalScore: number;
  lastShownAt?: string;
  manualRank?: number;
};

export type FeelingStats = {
  feeling: Feeling;
  interventionStats: Record<string, InterventionStats>;
};

export type PersonalizationState = {
  byFeeling: Record<Feeling, FeelingStats>;
};

export type SessionStep = {
  interventionId: string;
  shownAt: string;
  feedback?: FeedbackValue;
};

export type Session = {
  id: string;
  feeling: Feeling;
  intensity: Intensity;
  startedAt: string;
  steps: SessionStep[];
  completed: boolean;
};

export type AppScreen =
  | "onboarding"
  | "feeling-picker"
  | "intervention"
  | "feedback"
  | "another-prompt"
  | "completion";

export type AppState = {
  screen: AppScreen;
  feeling: Feeling | null;
  intensity: Intensity | null;
  session: Session | null;
  currentIntervention: Intervention | null;
  personalization: PersonalizationState;
  allShownThisSession: string[];
};
