// components/IntensitySelector/IntensitySelector.tsx
"use client";
import type { Intensity } from "@/types/app";

type Props = {
  value: Intensity | null;
  onChange: (v: Intensity) => void;
};

const LEVELS: { value: Intensity; label: string }[] = [
  { value: 1, label: "Mild" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "High" },
  { value: 4, label: "Very high" },
  { value: 5, label: "Intense" },
];

export default function IntensitySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2 animate-slide-up">
      <p id="intensity-label" className="text-sm font-medium text-stone-600">How intense?</p>
      <div role="group" aria-labelledby="intensity-label" className="flex gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => onChange(lvl.value)}
            aria-pressed={value === lvl.value}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 rounded-xl transition-all active:scale-95 ${
              value === lvl.value
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            <span className="text-sm font-semibold leading-none">{lvl.value}</span>
            <span className="text-[10px] font-medium leading-none opacity-70">{lvl.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
