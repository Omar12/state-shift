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
    <div className="flex flex-col flex-1 min-h-0">
      {/* Fixed top — heading + filter */}
      <div className="shrink-0 px-5 pt-8 pb-4 flex flex-col gap-4">
        <h1 id="feeling-heading" className="font-serif text-2xl font-semibold text-stone-800 tracking-tight leading-snug text-balance">
          How are you feeling right now?
        </h1>
        <label className="sr-only" htmlFor="feeling-filter">Filter feelings</label>
        <input
          id="feeling-filter"
          type="search"
          placeholder="Filter feelings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-600 placeholder-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-1"
        />
      </div>

      {/* Scrollable middle — grid + intensity */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5">
        <div className="flex flex-col gap-4 pb-4">
          <div role="group" aria-labelledby="feeling-heading" className="grid grid-cols-2 gap-3">
            {filtered.map((f) => (
              <button
                key={f.value}
                onClick={() => { setSelected(f.value); setIntensity(null); }}
                aria-pressed={selected === f.value}
                className={`flex flex-col items-center gap-2 py-5 rounded-2xl text-sm font-medium capitalize transition-all active:scale-95 ${
                  selected === f.value
                    ? "bg-stone-800 text-white hover:bg-stone-700"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                }`}
              >
                <span className="text-2xl">{f.emoji}</span>
                {f.value}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-2 text-center text-stone-600 text-sm py-8">
                No feelings matching &quot;{query}&quot;
              </p>
            )}
          </div>
          {selected && (
            <IntensitySelector value={intensity} onChange={setIntensity} />
          )}
        </div>
      </div>

      {/* Pinned bottom — Continue */}
      <div className="shrink-0 px-5 pt-3 pb-8">
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
    </div>
  );
}
