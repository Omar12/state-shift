// lib/feedback.ts
import type { Feeling, FeedbackValue, PersonalizationState, InterventionStats } from "@/types/app";
import { feedbackScoreMap } from "@/types/app";

export function recordFeedback(
  feeling: Feeling,
  interventionId: string,
  feedback: FeedbackValue,
  personalization: PersonalizationState
): PersonalizationState {
  const existing: InterventionStats = personalization.byFeeling[feeling]?.interventionStats[interventionId] ?? {
    interventionId,
    shownCount: 0,
    workedCount: 0,
    aLittleCount: 0,
    didntHelpCount: 0,
    totalScore: 0,
  };

  const updated: InterventionStats = {
    ...existing,
    workedCount: existing.workedCount + (feedback === "worked" ? 1 : 0),
    aLittleCount: existing.aLittleCount + (feedback === "a_little" ? 1 : 0),
    didntHelpCount: existing.didntHelpCount + (feedback === "didnt_help" ? 1 : 0),
    totalScore: existing.totalScore + feedbackScoreMap[feedback],
  };

  return {
    ...personalization,
    byFeeling: {
      ...personalization.byFeeling,
      [feeling]: {
        ...personalization.byFeeling[feeling],
        interventionStats: {
          ...personalization.byFeeling[feeling]?.interventionStats,
          [interventionId]: updated,
        },
      },
    },
  };
}

export function markShown(
  feeling: Feeling,
  interventionId: string,
  personalization: PersonalizationState
): PersonalizationState {
  const existing: InterventionStats = personalization.byFeeling[feeling]?.interventionStats[interventionId] ?? {
    interventionId,
    shownCount: 0,
    workedCount: 0,
    aLittleCount: 0,
    didntHelpCount: 0,
    totalScore: 0,
  };

  const updated: InterventionStats = {
    ...existing,
    shownCount: existing.shownCount + 1,
    lastShownAt: new Date().toISOString(),
  };

  return {
    ...personalization,
    byFeeling: {
      ...personalization.byFeeling,
      [feeling]: {
        ...personalization.byFeeling[feeling],
        interventionStats: {
          ...personalization.byFeeling[feeling]?.interventionStats,
          [interventionId]: updated,
        },
      },
    },
  };
}
