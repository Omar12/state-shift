import type { PersonalizationState, Session, Feeling } from "@/types/app";

export const STORAGE_KEYS = {
  onboardingComplete: "stateShift.onboardingComplete",
  personalization: "stateShift.personalization",
  sessions: "stateShift.sessions",
} as const;

const ALL_FEELINGS: Feeling[] = [
  "anxious", "nervous", "overwhelmed", "unfocused",
  "tired", "unmotivated", "stuck", "stressed",
];

export function defaultPersonalization(): PersonalizationState {
  return {
    byFeeling: Object.fromEntries(
      ALL_FEELINGS.map((f) => [f, { feeling: f, interventionStats: {} }])
    ) as PersonalizationState["byFeeling"],
  };
}

// In-memory fallback when localStorage is unavailable
let memStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memStore[key] ?? null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    memStore[key] = value;
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    delete memStore[key];
  }
}

export function getOnboardingComplete(): boolean {
  return safeGet(STORAGE_KEYS.onboardingComplete) === "true";
}

export function setOnboardingComplete(): void {
  safeSet(STORAGE_KEYS.onboardingComplete, "true");
}

export function loadPersonalization(): PersonalizationState {
  const raw = safeGet(STORAGE_KEYS.personalization);
  if (!raw) return defaultPersonalization();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      "byFeeling" in parsed &&
      typeof (parsed as PersonalizationState).byFeeling === "object"
    ) {
      // Merge with defaults to ensure all feelings exist
      const defaults = defaultPersonalization();
      const merged = { ...defaults, ...{ byFeeling: { ...defaults.byFeeling, ...(parsed as PersonalizationState).byFeeling } } };
      return merged;
    }
  } catch {
    // Corrupted — reset
    safeRemove(STORAGE_KEYS.personalization);
  }
  return defaultPersonalization();
}

export function savePersonalization(state: PersonalizationState): void {
  safeSet(STORAGE_KEYS.personalization, JSON.stringify(state));
}

export function loadSessions(): Session[] {
  const raw = safeGet(STORAGE_KEYS.sessions);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return parsed as Session[];
  } catch {
    safeRemove(STORAGE_KEYS.sessions);
  }
  return [];
}

export function saveSessions(sessions: Session[]): void {
  safeSet(STORAGE_KEYS.sessions, JSON.stringify(sessions));
}
