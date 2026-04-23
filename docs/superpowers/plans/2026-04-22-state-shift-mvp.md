# State Shift MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first web app that guides users through a 2-minute mental state shift via personalized interventions with feedback-driven ranking.

**Architecture:** Single-page app with a state-machine-style flow (onboarding → feeling picker → intervention → feedback → next/done). All state lives in React context + localStorage with safe fallbacks. No backend, no auth, no external deps beyond Next.js + Tailwind.

**Tech Stack:** Next.js 15 App Router, React, TypeScript strict mode, Tailwind CSS, localStorage.

---

## File Map

| File | Responsibility |
|------|---------------|
| `types/app.ts` | All shared TypeScript types |
| `content/interventions.ts` | Static intervention library (24 interventions) |
| `lib/storage.ts` | localStorage CRUD with safe parse + in-memory fallback |
| `lib/ranking.ts` | `getInterventionsForFeeling`, `rankInterventions`, `getNextIntervention` |
| `lib/feedback.ts` | `recordFeedback` — updates personalization state |
| `lib/session.ts` | Session creation, step recording, completion checks |
| `app/page.tsx` | Flow controller — renders current screen based on app state |
| `app/layout.tsx` | Root layout, metadata |
| `app/globals.css` | Base styles |
| `components/Onboarding/OnboardingScreen.tsx` | 2-step onboarding carousel |
| `components/FeelingPicker/FeelingPicker.tsx` | 8-feeling grid + intensity selector |
| `components/IntensitySelector/IntensitySelector.tsx` | 1–5 intensity picker sub-component |
| `components/InterventionCard/InterventionCard.tsx` | Title + instruction + optional timer |
| `components/Timer/Timer.tsx` | Countdown timer for `hasTimer` interventions |
| `components/FeedbackButtons/FeedbackButtons.tsx` | worked / a_little / didnt_help |
| `components/SupportBanner/SupportBanner.tsx` | Intensity-5 support message |
| `components/CompletionState/CompletionState.tsx` | Done screen with optional fallback copy |
| `components/AnotherPrompt/AnotherPrompt.tsx` | "Want another suggestion?" |

---

## Task 1: Type Definitions

**Files:**
- Create: `types/app.ts`

- [ ] **Step 1: Write the types file**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/omar/projects/vibe_coding_apps/anxiety-buddy
npx tsc --noEmit 2>&1
```

Expected: no errors (or only pre-existing Next.js scaffold errors)

- [ ] **Step 3: Commit**

```bash
git add types/app.ts
git commit -m "feat: add core type definitions"
```

---

## Task 2: Intervention Content

**Files:**
- Create: `content/interventions.ts`

- [ ] **Step 1: Write the interventions file**

```typescript
// content/interventions.ts
import type { Intervention } from "@/types/app";

export const INTERVENTIONS: Intervention[] = [
  // anxious
  {
    id: "anxious_double_exhale",
    feeling: "anxious",
    type: "physiological",
    title: "Double exhale",
    instruction:
      "Two quick breaths in through your nose.\nOne long breath out through your mouth.\nDo that three times.",
    durationSeconds: 20,
    hasTimer: true,
    sortOrder: 1,
  },
  {
    id: "anxious_321_around_you",
    feeling: "anxious",
    type: "grounding",
    title: "3-2-1 around you",
    instruction:
      "Name 3 things you see.\n2 things you hear.\n1 thing you feel touching your skin.",
    durationSeconds: 25,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "anxious_cold_on_wrists",
    feeling: "anxious",
    type: "environmental",
    title: "Cold on the wrists",
    instruction:
      "Run cold water over your wrists for 20 seconds.\nOr hold something cold for a bit.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 3,
  },
  // nervous
  {
    id: "nervous_let_it_ride",
    feeling: "nervous",
    type: "cognitive",
    title: "Let it ride",
    instruction:
      "You can feel nervous and still begin.\nTake one slow breath. Start anyway.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "nervous_use_the_jitters",
    feeling: "nervous",
    type: "behavioral",
    title: "Use the jitters",
    instruction:
      "That buzzy feeling has energy in it.\nPut it into your first move.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "nervous_feet_on_floor",
    feeling: "nervous",
    type: "physiological",
    title: "Feet on the floor",
    instruction:
      "Put both feet flat on the ground.\nDrop your shoulders.\nTake one long exhale.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 3,
  },
  // overwhelmed
  {
    id: "overwhelmed_just_next_one",
    feeling: "overwhelmed",
    type: "cognitive",
    title: "Just the next one",
    instruction:
      "You do not need to solve the whole pile.\nPick the next thing only.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "overwhelmed_dump_it_out",
    feeling: "overwhelmed",
    type: "behavioral",
    title: "Dump it out",
    instruction:
      "Write down everything in your head for 60 seconds.\nMessy is fine. Just get it out.",
    durationSeconds: 60,
    hasTimer: true,
    sortOrder: 2,
  },
  {
    id: "overwhelmed_change_your_spot",
    feeling: "overwhelmed",
    type: "environmental",
    title: "Change your spot",
    instruction:
      "Stand up and move somewhere else for 30 seconds.\nThen come back.",
    durationSeconds: 30,
    hasTimer: true,
    sortOrder: 3,
  },
  // stressed
  {
    id: "stressed_drop_shoulders",
    feeling: "stressed",
    type: "physiological",
    title: "Drop the shoulders",
    instruction:
      "Unclench your jaw.\nLet your shoulders fall.\nOpen your hands.\nTake one exhale.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "stressed_say_the_weight",
    feeling: "stressed",
    type: "cognitive",
    title: "Say the weight",
    instruction: "Say it in one sentence:\n\"I'm stressed because ___.\"",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "stressed_aim_for_done",
    feeling: "stressed",
    type: "cognitive",
    title: "Aim for done",
    instruction:
      "You do not need perfect right now.\nGo for done and fine.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 3,
  },
  // unmotivated
  {
    id: "unmotivated_start_tiny",
    feeling: "unmotivated",
    type: "behavioral",
    title: "Start tiny",
    instruction:
      "Open the doc.\nWrite one sentence.\nDo one rep.\nJust start there.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "unmotivated_30_seconds_go",
    feeling: "unmotivated",
    type: "behavioral",
    title: "30 seconds, go",
    instruction:
      "Start anything related to it for 30 seconds.\nNo plan. Just move.",
    durationSeconds: 30,
    hasTimer: true,
    sortOrder: 2,
  },
  {
    id: "unmotivated_use_a_song",
    feeling: "unmotivated",
    type: "environmental",
    title: "Use a song",
    instruction: "Put on one song you like.\nStart while it plays.",
    durationSeconds: 30,
    hasTimer: false,
    sortOrder: 3,
  },
  // stuck
  {
    id: "stuck_start_somewhere_else",
    feeling: "stuck",
    type: "behavioral",
    title: "Start somewhere else",
    instruction:
      "Skip the hardest part.\nBegin with the easiest piece.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "stuck_say_it_out_loud",
    feeling: "stuck",
    type: "cognitive",
    title: "Say it out loud",
    instruction:
      "Explain what you are stuck on out loud, like you are telling a friend.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "stuck_change_the_room",
    feeling: "stuck",
    type: "environmental",
    title: "Change the room",
    instruction:
      "Different chair, different desk, outside, hallway.\nMove first, then try again.",
    durationSeconds: 30,
    hasTimer: false,
    sortOrder: 3,
  },
  // unfocused
  {
    id: "unfocused_close_the_extras",
    feeling: "unfocused",
    type: "environmental",
    title: "Close the extras",
    instruction:
      "Close everything except the one thing you need.\nPhone face down.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "unfocused_one_minute_lock_in",
    feeling: "unfocused",
    type: "behavioral",
    title: "One-minute lock-in",
    instruction:
      "Give one thing your attention for 60 seconds.\nThat is all.",
    durationSeconds: 60,
    hasTimer: true,
    sortOrder: 2,
  },
  {
    id: "unfocused_one_sentence_target",
    feeling: "unfocused",
    type: "cognitive",
    title: "One sentence target",
    instruction: "Say: \"Right now I'm doing ___.\"\nThen do only that.",
    durationSeconds: 15,
    hasTimer: false,
    sortOrder: 3,
  },
  // tired
  {
    id: "tired_wake_the_body",
    feeling: "tired",
    type: "physiological",
    title: "Wake the body",
    instruction:
      "Stand up.\nReach up high.\nRoll your shoulders back three times.\nShake out your hands.",
    durationSeconds: 20,
    hasTimer: false,
    sortOrder: 1,
  },
  {
    id: "tired_water_and_cold",
    feeling: "tired",
    type: "environmental",
    title: "Water and cold",
    instruction:
      "Drink a full glass of water.\nSplash cold water on your face if you can.",
    durationSeconds: 30,
    hasTimer: false,
    sortOrder: 2,
  },
  {
    id: "tired_get_some_light",
    feeling: "tired",
    type: "environmental",
    title: "Get some light",
    instruction:
      "Step to a window or outside for one minute.\nLet some daylight hit your face.",
    durationSeconds: 60,
    hasTimer: true,
    sortOrder: 3,
  },
];

export function getInterventionsForFeeling(feeling: string): Intervention[] {
  return INTERVENTIONS.filter((i) => i.feeling === feeling);
}
```

- [ ] **Step 2: Verify compile**

```bash
npx tsc --noEmit 2>&1
```

Expected: no new errors

- [ ] **Step 3: Commit**

```bash
git add content/interventions.ts
git commit -m "feat: add intervention content library"
```

---

## Task 3: Storage Layer

**Files:**
- Create: `lib/storage.ts`

- [ ] **Step 1: Write storage module**

```typescript
// lib/storage.ts
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
```

- [ ] **Step 2: Verify compile**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/storage.ts
git commit -m "feat: add localStorage storage layer with in-memory fallback"
```

---

## Task 4: Ranking & Feedback Logic

**Files:**
- Create: `lib/ranking.ts`
- Create: `lib/feedback.ts`

- [ ] **Step 1: Write ranking module**

```typescript
// lib/ranking.ts
import type { Feeling, Intervention, PersonalizationState, InterventionStats } from "@/types/app";
import { getInterventionsForFeeling } from "@/content/interventions";

function getStats(
  feeling: Feeling,
  interventionId: string,
  personalization: PersonalizationState
): InterventionStats | undefined {
  return personalization.byFeeling[feeling]?.interventionStats[interventionId];
}

export function rankInterventions(
  feeling: Feeling,
  interventions: Intervention[],
  personalization: PersonalizationState
): Intervention[] {
  return [...interventions].sort((a, b) => {
    const sa = getStats(feeling, a.id, personalization);
    const sb = getStats(feeling, b.id, personalization);

    // 1. manualRank — lower number = higher priority
    const ma = sa?.manualRank ?? Infinity;
    const mb = sb?.manualRank ?? Infinity;
    if (ma !== mb) return ma - mb;

    // 2. highest totalScore
    const scoreA = sa?.totalScore ?? 0;
    const scoreB = sb?.totalScore ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;

    // 3. lowest shownCount
    const shownA = sa?.shownCount ?? 0;
    const shownB = sb?.shownCount ?? 0;
    if (shownA !== shownB) return shownA - shownB;

    // 4. least recently shown
    const lastA = sa?.lastShownAt ? new Date(sa.lastShownAt).getTime() : 0;
    const lastB = sb?.lastShownAt ? new Date(sb.lastShownAt).getTime() : 0;
    if (lastA !== lastB) return lastA - lastB;

    // 5. default curated sortOrder
    return a.sortOrder - b.sortOrder;
  });
}

export function getNextIntervention(
  feeling: Feeling,
  shownIds: string[],
  personalization: PersonalizationState
): Intervention | null {
  const all = getInterventionsForFeeling(feeling);
  const ranked = rankInterventions(feeling, all, personalization);
  return ranked.find((i) => !shownIds.includes(i.id)) ?? null;
}
```

- [ ] **Step 2: Write feedback module**

```typescript
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
```

- [ ] **Step 3: Verify compile**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add lib/ranking.ts lib/feedback.ts
git commit -m "feat: add ranking and feedback logic"
```

---

## Task 5: Session Logic

**Files:**
- Create: `lib/session.ts`

- [ ] **Step 1: Write session module**

```typescript
// lib/session.ts
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
```

- [ ] **Step 2: Verify compile**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/session.ts
git commit -m "feat: add session management logic"
```

---

## Task 6: Timer Component

**Files:**
- Create: `components/Timer/Timer.tsx`

- [ ] **Step 1: Write Timer component**

```typescript
// components/Timer/Timer.tsx
"use client";
import { useEffect, useState, useCallback } from "react";

type Props = {
  durationSeconds: number;
  onComplete?: () => void;
};

export default function Timer({ durationSeconds, onComplete }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleComplete = useCallback(() => {
    setDone(true);
    setRunning(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      handleComplete();
      return;
    }
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          handleComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining, handleComplete]);

  const pct = ((durationSeconds - remaining) / durationSeconds) * 100;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-stone-500">Done</p>
      </div>
    );
  }

  if (!running) {
    return (
      <button
        onClick={() => setRunning(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-sm text-stone-600 font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
        Start timer · {durationSeconds}s
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e7e5e4" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="#78716c"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-stone-700">
          {remaining}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Timer/Timer.tsx
git commit -m "feat: add countdown timer component"
```

---

## Task 7: Support Banner Component

**Files:**
- Create: `components/SupportBanner/SupportBanner.tsx`

- [ ] **Step 1: Write SupportBanner**

```typescript
// components/SupportBanner/SupportBanner.tsx
export default function SupportBanner() {
  return (
    <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <p>If this feels overwhelming, talking to someone you trust could help.</p>
      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
      >
        Support resources →
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SupportBanner/SupportBanner.tsx
git commit -m "feat: add support banner for intensity 5"
```

---

## Task 8: Onboarding Component

**Files:**
- Create: `components/Onboarding/OnboardingScreen.tsx`

- [ ] **Step 1: Write OnboardingScreen**

```typescript
// components/Onboarding/OnboardingScreen.tsx
"use client";
import { useState } from "react";

type Props = {
  onComplete: () => void;
};

const STEPS = [
  {
    title: "State Shift",
    body: "When you're feeling off, this app guides you through a quick reset — usually under 2 minutes.",
    cta: "How it works →",
  },
  {
    title: "Simple and private",
    body: "Pick how you feel, get one practical thing to try, tell us if it helped. Everything stays on your device. No account needed.",
    disclaimer:
      "This app is not therapy, diagnosis, or crisis care. If you're in distress, please reach out to a professional or someone you trust.",
    cta: "Let's go",
  },
];

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div className="flex flex-col h-full justify-between px-6 py-10">
      <div className="flex gap-1.5 justify-center mt-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-6 bg-stone-500" : "w-1.5 bg-stone-200"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 mt-12">
        <h1 className="text-3xl font-semibold text-stone-800 tracking-tight">
          {current.title}
        </h1>
        <p className="text-lg text-stone-500 leading-relaxed">{current.body}</p>
        {current.disclaimer && (
          <p className="text-sm text-stone-400 leading-relaxed border-l-2 border-stone-200 pl-3">
            {current.disclaimer}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
          } else {
            onComplete();
          }
        }}
        className="w-full py-4 rounded-2xl bg-stone-800 text-white text-base font-medium hover:bg-stone-700 active:scale-[0.98] transition-all"
      >
        {current.cta}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Onboarding/OnboardingScreen.tsx
git commit -m "feat: add onboarding screen (2 steps)"
```

---

## Task 9: Intensity Selector Component

**Files:**
- Create: `components/IntensitySelector/IntensitySelector.tsx`

- [ ] **Step 1: Write IntensitySelector**

```typescript
// components/IntensitySelector/IntensitySelector.tsx
"use client";
import type { Intensity } from "@/types/app";

type Props = {
  value: Intensity | null;
  onChange: (v: Intensity) => void;
};

const LEVELS: { value: Intensity; label: string }[] = [
  { value: 1, label: "Mild" },
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Intense" },
];

export default function IntensitySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-stone-500">How intense?</p>
      <div className="flex gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => onChange(lvl.value)}
            aria-label={`Intensity ${lvl.value}: ${lvl.label}`}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              value === lvl.value
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {lvl.value}
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-stone-400 text-center">
          {LEVELS.find((l) => l.value === value)?.label}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/IntensitySelector/IntensitySelector.tsx
git commit -m "feat: add intensity selector (1-5)"
```

---

## Task 10: Feeling Picker Component

**Files:**
- Create: `components/FeelingPicker/FeelingPicker.tsx`

- [ ] **Step 1: Write FeelingPicker**

```typescript
// components/FeelingPicker/FeelingPicker.tsx
"use client";
import { useState } from "react";
import type { Feeling, Intensity } from "@/types/app";
import IntensitySelector from "@/components/IntensitySelector/IntensitySelector";

type Props = {
  onContinue: (feeling: Feeling, intensity: Intensity) => void;
};

const FEELINGS: { value: Feeling; emoji: string }[] = [
  { value: "anxious", emoji: "😰" },
  { value: "nervous", emoji: "😬" },
  { value: "overwhelmed", emoji: "🌊" },
  { value: "stressed", emoji: "😤" },
  { value: "unmotivated", emoji: "😶" },
  { value: "stuck", emoji: "🧱" },
  { value: "unfocused", emoji: "🌀" },
  { value: "tired", emoji: "😴" },
];

export default function FeelingPicker({ onContinue }: Props) {
  const [selected, setSelected] = useState<Feeling | null>(null);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? FEELINGS.filter((f) => f.value.includes(query.toLowerCase()))
    : FEELINGS;

  const canContinue = selected !== null && intensity !== null;

  return (
    <div className="flex flex-col h-full px-5 py-8 gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">
          How are you feeling right now?
        </h1>
      </div>

      <input
        type="search"
        placeholder="Filter feelings..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
      />

      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
        {filtered.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelected(f.value)}
            className={`flex flex-col items-center gap-2 py-5 rounded-2xl text-sm font-medium capitalize transition-all active:scale-95 ${
              selected === f.value
                ? "bg-stone-800 text-white"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <span className="text-2xl">{f.emoji}</span>
            {f.value}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-stone-400 text-sm py-8">
            No feelings matching "{query}"
          </p>
        )}
      </div>

      {selected && (
        <IntensitySelector value={intensity} onChange={setIntensity} />
      )}

      <button
        disabled={!canContinue}
        onClick={() => {
          if (selected && intensity) onContinue(selected, intensity);
        }}
        className={`w-full py-4 rounded-2xl text-base font-medium transition-all ${
          canContinue
            ? "bg-stone-800 text-white hover:bg-stone-700 active:scale-[0.98]"
            : "bg-stone-100 text-stone-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FeelingPicker/FeelingPicker.tsx
git commit -m "feat: add feeling picker with filter and intensity selector"
```

---

## Task 11: Feedback Buttons Component

**Files:**
- Create: `components/FeedbackButtons/FeedbackButtons.tsx`

- [ ] **Step 1: Write FeedbackButtons**

```typescript
// components/FeedbackButtons/FeedbackButtons.tsx
"use client";
import type { FeedbackValue } from "@/types/app";

type Props = {
  value: FeedbackValue | null;
  onChange: (v: FeedbackValue) => void;
};

const OPTIONS: { value: FeedbackValue; label: string; emoji: string }[] = [
  { value: "worked", label: "Worked", emoji: "✓" },
  { value: "a_little", label: "A little", emoji: "~" },
  { value: "didnt_help", label: "Didn't help", emoji: "✗" },
];

export default function FeedbackButtons({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-stone-500 text-center">How did that feel?</p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              value === opt.value
                ? "bg-stone-800 text-white"
                : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FeedbackButtons/FeedbackButtons.tsx
git commit -m "feat: add feedback buttons (worked/a_little/didnt_help)"
```

---

## Task 12: Intervention Card Component

**Files:**
- Create: `components/InterventionCard/InterventionCard.tsx`

- [ ] **Step 1: Write InterventionCard**

```typescript
// components/InterventionCard/InterventionCard.tsx
"use client";
import type { Intervention, FeedbackValue, Intensity } from "@/types/app";
import Timer from "@/components/Timer/Timer";
import FeedbackButtons from "@/components/FeedbackButtons/FeedbackButtons";
import SupportBanner from "@/components/SupportBanner/SupportBanner";

type Props = {
  intervention: Intervention;
  intensity: Intensity;
  feedback: FeedbackValue | null;
  onFeedback: (v: FeedbackValue) => void;
  onSubmitFeedback: () => void;
};

export default function InterventionCard({
  intervention,
  intensity,
  feedback,
  onFeedback,
  onSubmitFeedback,
}: Props) {
  const lines = intervention.instruction.split("\n");

  return (
    <div className="flex flex-col h-full px-5 py-8 gap-6">
      {intensity === 5 && <SupportBanner />}

      <div className="flex-1 flex flex-col gap-5 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-stone-400">
            {intervention.type}
          </span>
        </div>
        <h2 className="text-3xl font-semibold text-stone-800 tracking-tight leading-tight">
          {intervention.title}
        </h2>
        <div className="flex flex-col gap-2">
          {lines.map((line, i) => (
            <p key={i} className="text-lg text-stone-500 leading-relaxed">
              {line}
            </p>
          ))}
        </div>

        {intervention.hasTimer && (
          <div className="mt-2 flex justify-center">
            <Timer durationSeconds={intervention.durationSeconds} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <FeedbackButtons value={feedback} onChange={onFeedback} />
        <button
          disabled={feedback === null}
          onClick={onSubmitFeedback}
          className={`w-full py-4 rounded-2xl text-base font-medium transition-all ${
            feedback !== null
              ? "bg-stone-800 text-white hover:bg-stone-700 active:scale-[0.98]"
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/InterventionCard/InterventionCard.tsx
git commit -m "feat: add intervention card with feedback and timer"
```

---

## Task 13: Another Prompt & Completion State Components

**Files:**
- Create: `components/AnotherPrompt/AnotherPrompt.tsx`
- Create: `components/CompletionState/CompletionState.tsx`

- [ ] **Step 1: Write AnotherPrompt**

```typescript
// components/AnotherPrompt/AnotherPrompt.tsx
"use client";

type Props = {
  onYes: () => void;
  onDone: () => void;
};

export default function AnotherPrompt({ onYes, onDone }: Props) {
  return (
    <div className="flex flex-col h-full px-5 py-8 gap-6 justify-center">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-stone-800 tracking-tight">
          Want another suggestion?
        </h2>
        <p className="text-stone-400 text-base">
          You can try something else or call it here.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={onYes}
          className="w-full py-4 rounded-2xl bg-stone-800 text-white text-base font-medium hover:bg-stone-700 active:scale-[0.98] transition-all"
        >
          Yes, try another
        </button>
        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl bg-stone-50 text-stone-600 text-base font-medium hover:bg-stone-100 active:scale-[0.98] transition-all border border-stone-200"
        >
          I'm done
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write CompletionState**

```typescript
// components/CompletionState/CompletionState.tsx
"use client";

type Props = {
  allUsed?: boolean;
  nothingHelped?: boolean;
  onHome: () => void;
};

export default function CompletionState({ allUsed, nothingHelped, onHome }: Props) {
  return (
    <div className="flex flex-col h-full px-5 py-8 gap-6 justify-center">
      <div className="flex flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-stone-800 tracking-tight">
          {allUsed ? "That's all for now" : "You showed up."}
        </h2>
        <p className="text-stone-400 text-base leading-relaxed">
          {nothingHelped
            ? "Sometimes nothing clicks right away, and that's okay. Be gentle with yourself."
            : "Small steps matter. Come back whenever you need a reset."}
        </p>
        {nothingHelped && (
          <p className="text-sm text-stone-400 border-l-2 border-stone-200 pl-3 leading-relaxed">
            If you're struggling, talking to someone you trust or a professional can help.{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-stone-600 transition-colors"
            >
              Support resources →
            </a>
          </p>
        )}
      </div>
      <button
        onClick={onHome}
        className="w-full py-4 rounded-2xl bg-stone-800 text-white text-base font-medium hover:bg-stone-700 active:scale-[0.98] transition-all mt-4"
      >
        Back home
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/AnotherPrompt/AnotherPrompt.tsx components/CompletionState/CompletionState.tsx
git commit -m "feat: add another-prompt and completion state components"
```

---

## Task 14: Main App Flow (page.tsx)

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Update globals.css**

Replace the content with:

```css
/* app/globals.css */
@import "tailwindcss";

html, body {
  height: 100%;
}

* {
  -webkit-tap-highlight-color: transparent;
}
```

- [ ] **Step 2: Update layout.tsx**

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "State Shift",
  description: "A 2-minute mental reset",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Write page.tsx — the main flow controller**

```typescript
// app/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import type { Feeling, Intensity, FeedbackValue, AppScreen, PersonalizationState, Session, Intervention } from "@/types/app";
import { getOnboardingComplete, setOnboardingComplete, loadPersonalization, savePersonalization } from "@/lib/storage";
import { getNextIntervention } from "@/lib/ranking";
import { recordFeedback, markShown } from "@/lib/feedback";
import { createSession, recordStep, recordStepFeedback, completeSession, getShownIds, isAllUsed } from "@/lib/session";
import { getInterventionsForFeeling } from "@/content/interventions";

import OnboardingScreen from "@/components/Onboarding/OnboardingScreen";
import FeelingPicker from "@/components/FeelingPicker/FeelingPicker";
import InterventionCard from "@/components/InterventionCard/InterventionCard";
import AnotherPrompt from "@/components/AnotherPrompt/AnotherPrompt";
import CompletionState from "@/components/CompletionState/CompletionState";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentIntervention, setCurrentIntervention] = useState<Intervention | null>(null);
  const [feedback, setFeedback] = useState<FeedbackValue | null>(null);
  const [personalization, setPersonalization] = useState<PersonalizationState | null>(null);
  const [allUsed, setAllUsed] = useState(false);
  const [nothingHelped, setNothingHelped] = useState(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    const onboarded = getOnboardingComplete();
    const pers = loadPersonalization();
    setPersonalization(pers);
    setScreen(onboarded ? "feeling-picker" : "onboarding");
    setMounted(true);
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setOnboardingComplete();
    setScreen("feeling-picker");
  }, []);

  const handleFeelingSelected = useCallback(
    (f: Feeling, i: Intensity) => {
      if (!personalization) return;
      const newSession = createSession(f, i);
      const next = getNextIntervention(f, [], personalization);
      if (!next) {
        setScreen("completion");
        return;
      }
      let pers = markShown(f, next.id, personalization);
      setPersonalization(pers);
      savePersonalization(pers);
      const updatedSession = recordStep(newSession, next.id);
      setFeeling(f);
      setIntensity(i);
      setSession(updatedSession);
      setCurrentIntervention(next);
      setFeedback(null);
      setAllUsed(false);
      setNothingHelped(false);
      setScreen("intervention");
    },
    [personalization]
  );

  const handleSubmitFeedback = useCallback(() => {
    if (!session || !currentIntervention || !feedback || !feeling || !personalization) return;

    // Record feedback in session
    const updatedSession = recordStepFeedback(session, currentIntervention.id, feedback);
    setSession(updatedSession);

    // Update personalization
    let pers = recordFeedback(feeling, currentIntervention.id, feedback, personalization);
    setPersonalization(pers);
    savePersonalization(pers);

    const total = getInterventionsForFeeling(feeling).length;
    if (isAllUsed(updatedSession, total)) {
      // Check if nothing helped
      const allDidntHelp = updatedSession.steps.every((s) => s.feedback === "didnt_help");
      setAllUsed(true);
      setNothingHelped(allDidntHelp);
      setSession(completeSession(updatedSession));
      setScreen("completion");
    } else {
      setScreen("another-prompt");
    }
  }, [session, currentIntervention, feedback, feeling, personalization]);

  const handleAnotherYes = useCallback(() => {
    if (!session || !feeling || !personalization) return;
    const shownIds = getShownIds(session);
    const next = getNextIntervention(feeling, shownIds, personalization);
    if (!next) {
      setAllUsed(true);
      setSession(completeSession(session));
      setScreen("completion");
      return;
    }
    let pers = markShown(feeling, next.id, personalization);
    setPersonalization(pers);
    savePersonalization(pers);
    const updatedSession = recordStep(session, next.id);
    setSession(updatedSession);
    setCurrentIntervention(next);
    setFeedback(null);
    setScreen("intervention");
  }, [session, feeling, personalization]);

  const handleDone = useCallback(() => {
    if (session) setSession(completeSession(session));
    setScreen("completion");
  }, [session]);

  const handleHome = useCallback(() => {
    setFeeling(null);
    setIntensity(null);
    setSession(null);
    setCurrentIntervention(null);
    setFeedback(null);
    setAllUsed(false);
    setNothingHelped(false);
    setScreen("feeling-picker");
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-dvh max-w-md mx-auto flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-stone-300 border-t-stone-600 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-dvh max-w-md mx-auto flex flex-col">
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {screen === "feeling-picker" && (
        <FeelingPicker onContinue={handleFeelingSelected} />
      )}
      {screen === "intervention" && currentIntervention && intensity && (
        <InterventionCard
          intervention={currentIntervention}
          intensity={intensity}
          feedback={feedback}
          onFeedback={setFeedback}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}
      {screen === "another-prompt" && (
        <AnotherPrompt onYes={handleAnotherYes} onDone={handleDone} />
      )}
      {screen === "completion" && (
        <CompletionState
          allUsed={allUsed}
          nothingHelped={nothingHelped}
          onHome={handleHome}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 4: Verify compile**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: wire up main app flow controller"
```

---

## Task 15: Run & Test the App

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: server starts on http://localhost:3000

- [ ] **Step 2: Manual test core loop**

Visit http://localhost:3000 and verify:
- Onboarding shows on first load (2 steps)
- After onboarding, feeling picker shows
- Selecting a feeling reveals intensity selector
- Continue button disabled until both selected
- Continue navigates to intervention card
- Instruction lines render correctly (newlines)
- Feedback buttons work; submit disabled until feedback selected
- "Want another?" appears after feedback
- Choosing "Yes" shows next intervention (different one)
- After 3 interventions all used → completion screen
- "Back home" returns to feeling picker
- Refresh after onboarding goes to feeling picker (not onboarding)

- [ ] **Step 3: Test intensity 5 support banner**

Select any feeling, set intensity to 5, click continue.
Expected: amber support banner visible on intervention screen.

- [ ] **Step 4: Test personalization persists**

Complete a session with "worked" for one intervention. Refresh. Start new session with same feeling.
Expected: that intervention appears first in ranking (it has the highest score).

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "chore: verify all acceptance criteria pass"
```

---

## Task 16: Edge Case Hardening

**Files:**
- Modify: `lib/storage.ts` (already written defensively)
- Modify: `app/page.tsx` (add localStorage corruption test)

- [ ] **Step 1: Test corrupted localStorage**

Open browser console and run:
```javascript
localStorage.setItem('stateShift.personalization', '{invalid json}')
```

Then refresh. Expected: app loads normally, no crash, personalization resets to default.

- [ ] **Step 2: Test localStorage unavailable simulation**

In browser DevTools → Application → Storage → Local Storage → right-click → Clear. Then disable storage via DevTools (or test in private browsing). Expected: app functions for the session without persisting.

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "chore: verified edge cases - corrupted storage, unavailable storage, all interventions used"
```

---

## Task 17: Visual Polish

**Files:**
- Modify: `app/globals.css`
- Modify: `app/page.tsx` (transitions between screens)

- [ ] **Step 1: Add screen transition to page.tsx**

Wrap each screen render in a consistent fade-in by adding this utility class pattern. At the top of `page.tsx`, add a key-based remount trick so each screen fades in:

```typescript
// Add this wrapper div around each screen render in the return:
// Replace each screen's direct component with:
<div key={screen} className="flex flex-col h-full animate-fade-in">
  {/* component */}
</div>
```

- [ ] **Step 2: Add animation to globals.css**

Add to `app/globals.css`:
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out both;
}
```

- [ ] **Step 3: Verify visual quality**

Run through the full core loop once more:
- Transitions feel calm and smooth
- No layout shift
- Tap targets feel large enough on mobile viewport (375px width in DevTools)
- Text is readable at all steps
- No visual clutter

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/page.tsx
git commit -m "feat: add screen fade-in transitions"
```

---

## Self-Review: Spec Coverage

| Spec Section | Covered? | Task |
|---|---|---|
| Onboarding (first launch only, 2 screens, not-therapy disclaimer) | ✓ | Task 8 |
| Feeling selection (8 feelings, filter, one selection) | ✓ | Task 10 |
| Intensity selector (1–5) | ✓ | Task 9 |
| Continue button disabled until both selected | ✓ | Task 10 |
| Intervention screen (title, instruction, timer if hasTimer) | ✓ | Task 12 |
| Feedback (worked/a_little/didnt_help, required before continuing) | ✓ | Task 11, 12 |
| Another suggestion prompt (Yes / I'm done) | ✓ | Task 13 |
| Completion state (done, all used, fallback if nothing helped) | ✓ | Task 13 |
| Intensity 5 support banner | ✓ | Task 7 |
| All 24 interventions exact content | ✓ | Task 2 |
| Personalization ranking (manualRank → score → shownCount → lastShown → sortOrder) | ✓ | Task 4 |
| recordFeedback updates counts and score | ✓ | Task 4 |
| No repeat in same session | ✓ | getShownIds in Task 14 |
| localStorage safe parse + in-memory fallback | ✓ | Task 3 |
| Corrupted storage recovery | ✓ | Task 3, 16 |
| Session model (id, feeling, intensity, steps, completed) | ✓ | Task 5 |
| markShown updates shownCount + lastShownAt | ✓ | Task 4 (feedback.ts) |
| mobile-first responsive | ✓ | max-w-md, tap targets |
| TypeScript strict mode | ✓ | tsconfig inherited |
