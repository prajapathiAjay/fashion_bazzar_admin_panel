export default function RangeTabs({ ranges, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-white p-1" role="tablist">
      {ranges.map((r) => (
        <button
          key={r.key}
          role="tab"
          aria-selected={value === r.key}
          onClick={() => onChange(r.key)}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            value === r.key ? "bg-brand font-medium text-white shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
