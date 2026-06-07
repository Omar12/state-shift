import type { Session, Feeling, Intensity, FeedbackValue, SessionStep } from "@/types/app";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createSession(feeling: Feeling, intensity: Intensity): Session {
  return {
    id: generateId(),
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
