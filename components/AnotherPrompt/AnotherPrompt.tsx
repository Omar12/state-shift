"use client";

type Props = {
  onYes: () => void;
  onDone: () => void;
};

export default function AnotherPrompt({ onYes, onDone }: Props) {
  return (
    <div className="flex flex-col h-full px-5 py-8 gap-6 justify-center">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-stone-800 tracking-tight">
          Want another suggestion?
        </h2>
        <p className="text-stone-400 text-base">
          You can try something else or call it here.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={onYes}
          className="w-full py-4 rounded-2xl bg-stone-800 text-white text-base font-medium hover:bg-stone-700 active:scale-[0.98] transition-all"
        >
          Yes, try another
        </button>
        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl bg-stone-50 text-stone-600 text-base font-medium hover:bg-stone-100 active:scale-[0.98] transition-all border border-stone-200"
        >
          I&apos;m done
        </button>
      </div>
    </div>
  );
}
