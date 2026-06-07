"use client";
import type { FeedbackValue } from "@/types/app";

type Props = {
  value: FeedbackValue | null;
  onChange: (v: FeedbackValue) => void;
};

const OPTIONS: { value: FeedbackValue; label: string }[] = [
  { value: "worked", label: "Helped" },
  { value: "a_little", label: "A little" },
  { value: "didnt_help", label: "Didn't help" },
];

export default function FeedbackButtons({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p id="feedback-label" className="text-sm font-medium text-stone-600 text-center">How did that feel?</p>
      <div role="group" aria-labelledby="feedback-label" className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`flex-1 py-4 rounded-xl text-sm font-medium transition-all active:scale-95 ${
              value === opt.value
                ? "bg-stone-800 text-white"
                : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
