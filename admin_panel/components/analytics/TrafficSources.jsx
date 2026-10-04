import { formatNumber } from "@/components/dashboard/format";

export default function TrafficSources({ sources }) {
  const max = Math.max(...sources.map((s) => s.sessions));
  const total = sources.reduce((a, s) => a + s.sessions, 0);
  const best = sources.reduce((a, s) => (s.conversion > a.conversion ? s : a));

  return (
    <div>
      <div className="mb-3 flex justify-between text-[11px] font-medium uppercase tracking-wide text-[#A6A69C]">
        <span>Source</span>
        <span>Sessions · Conv.</span>
      </div>
      <ul className="space-y-3.5">
        {sources.map((s) => (
          <li key={s.source} title={`${s.source}: ${formatNumber(s.sessions)} sessions, ${s.conversion}% conversion`}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span className="text-[#2A2A28]">{s.source}</span>
              <span className="tabular-nums text-[#6B6B63]">
                {formatNumber(s.sessions)}
                <span className="ml-2 inline-block w-10 text-right text-xs font-medium text-[#2A2A28]">
                  {s.conversion}%
                </span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F3F0EA]">
              <div className="h-1.5 rounded-full bg-[#7A1F2B]" style={{ width: `${(s.sessions / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-[#EFECE5] pt-3 text-xs text-[#8A8A80]">
        <span className="font-medium text-[#2A2A28]">{best.source}</span> converts best at {best.conversion}% ·{" "}
        {formatNumber(total)} sessions in total
      </p>
    </div>
  );
}
