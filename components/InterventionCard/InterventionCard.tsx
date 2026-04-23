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
