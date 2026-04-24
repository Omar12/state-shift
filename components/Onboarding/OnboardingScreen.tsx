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
    <div className="flex flex-col flex-1 justify-between px-6 py-10">
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
        <h1 className="font-serif text-3xl font-semibold text-stone-800 tracking-tight leading-snug">
          {current.title}
        </h1>
        <p className="text-base text-stone-600 leading-relaxed">{current.body}</p>
        {current.disclaimer && (
          <p className="text-sm text-stone-600 leading-relaxed border-l-2 border-stone-200 pl-3">
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
