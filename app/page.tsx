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

  // Hydrate from localStorage after mount (avoids SSR mismatch)
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
      const pers = markShown(f, next.id, personalization);
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

    const updatedSession = recordStepFeedback(session, currentIntervention.id, feedback);
    setSession(updatedSession);

    let pers = recordFeedback(feeling, currentIntervention.id, feedback, personalization);
    setPersonalization(pers);
    savePersonalization(pers);

    const total = getInterventionsForFeeling(feeling).length;
    if (isAllUsed(updatedSession, total)) {
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
    const pers = markShown(feeling, next.id, personalization);
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
        <div key="onboarding" className="flex flex-col flex-1 animate-fade-in">
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        </div>
      )}
      {screen === "feeling-picker" && (
        <div key="feeling-picker" className="flex flex-col flex-1 animate-fade-in">
          <FeelingPicker onContinue={handleFeelingSelected} />
        </div>
      )}
      {screen === "intervention" && currentIntervention && intensity && (
        <div key={currentIntervention.id} className="flex flex-col flex-1 animate-fade-in">
          <InterventionCard
            intervention={currentIntervention}
            intensity={intensity}
            feedback={feedback}
            onFeedback={setFeedback}
            onSubmitFeedback={handleSubmitFeedback}
          />
        </div>
      )}
      {screen === "another-prompt" && (
        <div key="another-prompt" className="flex flex-col flex-1 animate-fade-in">
          <AnotherPrompt onYes={handleAnotherYes} onDone={handleDone} />
        </div>
      )}
      {screen === "completion" && (
        <div key="completion" className="flex flex-col flex-1 animate-fade-in">
          <CompletionState
            allUsed={allUsed}
            nothingHelped={nothingHelped}
            onHome={handleHome}
          />
        </div>
      )}
    </main>
  );
}
