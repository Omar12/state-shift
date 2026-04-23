// components/Timer/Timer.tsx
"use client";
import { useEffect, useState, useCallback } from "react";

type Props = {
  durationSeconds: number;
  onComplete?: () => void;
};

export default function Timer({ durationSeconds, onComplete }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleComplete = useCallback(() => {
    setDone(true);
    setRunning(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      handleComplete();
      return;
    }
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          handleComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining, handleComplete]);

  const pct = ((durationSeconds - remaining) / durationSeconds) * 100;

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm text-stone-500">Done</p>
      </div>
    );
  }

  if (!running) {
    return (
      <button
        onClick={() => setRunning(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-sm text-stone-600 font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
        Start timer · {durationSeconds}s
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#e7e5e4" strokeWidth="4" />
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="#78716c"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-stone-700">
          {remaining}
        </span>
      </div>
    </div>
  );
}
