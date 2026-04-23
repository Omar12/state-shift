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
    <div className="flex flex-col min-h-full px-5 py-8 gap-6">
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

      <div className="grid grid-cols-2 gap-3">
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
            No feelings matching &quot;{query}&quot;
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
