export default function RangeTabs({ ranges, value, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-[#E8E4DC] bg-white p-1" role="tablist">
      {ranges.map((r) => (
        <button
          key={r.key}
          role="tab"
          aria-selected={value === r.key}
          onClick={() => onChange(r.key)}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            value === r.key ? "bg-[#7A1F2B] font-medium text-white shadow-sm" : "text-[#6B6B63] hover:text-[#2A2A28]"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
