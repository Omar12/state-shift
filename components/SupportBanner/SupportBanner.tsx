// components/SupportBanner/SupportBanner.tsx
export default function SupportBanner() {
  return (
    <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <p>If this feels overwhelming, talking to someone you trust could help.</p>
      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
      >
        Support resources →
      </a>
    </div>
  );
}
