"use client";

type Props = {
  allUsed?: boolean;
  nothingHelped?: boolean;
  onHome: () => void;
};

export default function CompletionState({ allUsed, nothingHelped, onHome }: Props) {
  return (
    <div className="flex flex-col flex-1 px-5 py-8 gap-6 justify-center">
      <div className="flex flex-col gap-4">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-stone-800 tracking-tight">
          {allUsed ? "That's all for now" : "You showed up."}
        </h2>
        <p className="text-stone-400 text-base leading-relaxed">
          {nothingHelped
            ? "Sometimes nothing clicks right away, and that's okay. Be gentle with yourself."
            : "Small steps matter. Come back whenever you need a reset."}
        </p>
        {nothingHelped && (
          <p className="text-sm text-stone-400 border-l-2 border-stone-200 pl-3 leading-relaxed">
            If you&apos;re struggling, talking to someone you trust or a professional can help.{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-stone-600 transition-colors"
            >
              Support resources →
            </a>
          </p>
        )}
      </div>
      <button
        onClick={onHome}
        className="w-full py-4 rounded-2xl bg-stone-800 text-white text-base font-medium hover:bg-stone-700 active:scale-[0.98] transition-all mt-4"
      >
        Back home
      </button>
    </div>
  );
}
