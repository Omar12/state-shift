// components/SupportBanner/SupportBanner.tsx
export default function SupportBanner() {
  return (
    <div
      className="w-full rounded-xl px-4 py-3 text-sm text-stone-600"
      style={{
        backgroundColor: "var(--color-care-bg)",
        border: "1px solid var(--color-care-border)",
      }}
    >
      <p>If this feels overwhelming, talking to someone you trust could help.</p>
      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support resources (opens in new tab)"
        className="mt-1 inline-block underline underline-offset-2 transition-colors hover:opacity-80"
        style={{ color: "var(--color-care-ink)" }}
      >
        Support resources →
      </a>
    </div>
  );
}
