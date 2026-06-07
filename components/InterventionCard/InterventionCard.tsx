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
  onBack: () => void;
};

export default function InterventionCard({
  intervention,
  intensity,
  feedback,
  onFeedback,
  onSubmitFeedback,
  onBack,
}: Props) {
  const lines = intervention.instruction.split("\n").filter((l) => l.trim() !== "");

  return (
    <div className="flex flex-col flex-1 px-5 py-8 gap-6">
      <div className="shrink-0">
        <button
          onClick={onBack}
          aria-label="Back to feeling picker"
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors -ml-1 px-1 py-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2"
        >
          <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      {intensity === 5 && <SupportBanner />}

      <div className="flex-1 flex flex-col gap-5 justify-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-stone-600">
            {intervention.type}
          </span>
        </div>
        <h2 className="font-serif text-3xl font-semibold text-stone-800 tracking-tight leading-snug text-balance break-words">
          {intervention.title}
        </h2>
        <div className="flex flex-col gap-2">
          {lines.map((line, i) => (
            <p key={i} className="text-base text-stone-600 leading-relaxed text-pretty break-words">
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
