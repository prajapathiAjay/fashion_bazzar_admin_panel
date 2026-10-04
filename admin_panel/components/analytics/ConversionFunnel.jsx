import { ChevronDown } from "lucide-react";
import { formatNumber } from "@/components/dashboard/format";

export default function ConversionFunnel({ stages }) {
  const top = stages[0].count;
  const overall = ((stages[stages.length - 1].count / top) * 100).toFixed(2);

  return (
    <div>
      <div className="mb-5 flex items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight text-[#2A2A28] tabular-nums">{overall}%</p>
        <p className="text-xs text-[#8A8A80]">of sessions end in a purchase</p>
      </div>

      <ol>
        {stages.map((s, i) => {
          const pct = (s.count / top) * 100;
          const prev = stages[i - 1];
          const drop = prev ? (100 - (s.count / prev.count) * 100).toFixed(1) : null;

          return (
            <li key={s.stage}>
              {drop && (
                <div className="flex items-center gap-1.5 py-1.5 pl-[156px] text-xs text-[#A6A69C]">
                  <ChevronDown size={12} />
                  <span>
                    <span className="font-medium text-red-700">{drop}%</span> drop-off
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4" title={`${s.stage}: ${formatNumber(s.count)}`}>
                <div className="w-[140px] shrink-0 leading-tight">
                  <p className="text-sm text-[#2A2A28]">{s.stage}</p>
                  <p className="text-xs tabular-nums text-[#A6A69C]">{formatNumber(s.count)}</p>
                </div>
                <div className="relative h-9 flex-1 rounded-md bg-[#F7F5F0]">
                  <div
                    className="h-full rounded-md bg-[#7A1F2B] transition-all"
                    style={{ width: `${Math.max(pct, 1.5)}%`, opacity: 1 - i * 0.14 }}
                  />
                  <span
                    className={`absolute inset-y-0 flex items-center text-xs font-medium tabular-nums ${
                      pct > 18 ? "left-3 text-white" : "text-[#2A2A28]"
                    }`}
                    style={pct > 18 ? undefined : { left: `calc(${Math.max(pct, 1.5)}% + 8px)` }}
                  >
                    {pct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
