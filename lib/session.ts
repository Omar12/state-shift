import type { Session, Feeling, Intensity, FeedbackValue, SessionStep } from "@/types/app";

export function createSession(feeling: Feeling, intensity: Intensity): Session {
  return {
    id: crypto.randomUUID(),
    feeling,
    intensity,
    startedAt: new Date().toISOString(),
    steps: [],
    completed: false,
  };
}

export function recordStep(session: Session, interventionId: string): Session {
  const step: SessionStep = {
    interventionId,
    shownAt: new Date().toISOString(),
  };
  return { ...session, steps: [...session.steps, step] };
}

export function recordStepFeedback(
  session: Session,
  interventionId: string,
  feedback: FeedbackValue
): Session {
  return {
    ...session,
    steps: session.steps.map((s) =>
      s.interventionId === interventionId ? { ...s, feedback } : s
    ),
  };
}

export function completeSession(session: Session): Session {
  return { ...session, completed: true };
}

export function getShownIds(session: Session): string[] {
  return session.steps.map((s) => s.interventionId);
}

export function isAllUsed(session: Session, totalInterventions: number): boolean {
  return session.steps.length >= totalInterventions;
}
