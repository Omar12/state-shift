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
