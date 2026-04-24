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
      <p id="intensity-label" className="text-sm font-medium text-stone-600">How intense?</p>
      <div role="group" aria-labelledby="intensity-label" className="flex gap-2">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.value}
            onClick={() => onChange(lvl.value)}
            aria-label={`Intensity ${lvl.value}: ${lvl.label}`}
            aria-pressed={value === lvl.value}
            className={`flex-1 py-4 rounded-xl text-sm font-medium transition-all active:scale-95 ${
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
        <p className="text-xs text-stone-600 text-center">
          {LEVELS.find((l) => l.value === value)?.label}
        </p>
      )}
    </div>
  );
}
