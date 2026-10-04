"use client";

import { useState } from "react";
import { formatNumber, niceTicks } from "@/components/dashboard/format";

const CHART_H = 220;

export default function CustomerMix({ data }) {
  const [hover, setHover] = useState(null);
  const { months, colors } = data;
  const totals = months.map((_, i) => data.new[i] + data.returning[i]);
  const ticks = niceTicks(Math.max(...totals));
  const yMax = ticks[ticks.length - 1];

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 text-xs text-[#6B6B63]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors.new }} /> New
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colors.returning }} /> Returning
        </span>
      </div>

      <div className="flex">
        {/* Y axis */}
        <div className="relative w-12 shrink-0" style={{ height: CHART_H }}>
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-3 -translate-y-1/2 text-[11px] tabular-nums text-[#A6A69C]"
              style={{ bottom: `${(t / yMax) * 100}%` }}
            >
              {t >= 1000 ? `${t / 1000}K` : t}
            </span>
          ))}
        </div>

        <div className="flex-1">
          <div className="relative" style={{ height: CHART_H }}>
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 border-t border-[#EFECE5]"
                style={{ bottom: `${(t / yMax) * 100}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-end justify-around gap-3 px-2">
              {months.map((m, i) => (
                <div
                  key={m}
                  className="relative flex h-full w-full max-w-[44px] cursor-default flex-col justify-end"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {/* Stack: returning on top of new, 2px gap between */}
                  <div
                    className="rounded-t-[4px] transition-opacity"
                    style={{
                      height: `${(data.returning[i] / yMax) * 100}%`,
                      backgroundColor: colors.returning,
                      opacity: hover === null || hover === i ? 1 : 0.45,
                    }}
                  />
                  <div
                    className="mt-[2px] transition-opacity"
                    style={{
                      height: `${(data.new[i] / yMax) * 100}%`,
                      backgroundColor: colors.new,
                      opacity: hover === null || hover === i ? 1 : 0.45,
                    }}
                  />

                  {hover === i && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-40 -translate-x-1/2 rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-xs shadow-lg">
                      <p className="mb-1.5 font-medium text-[#2A2A28]">{m} 2026</p>
                      {[
                        ["New", data.new[i], colors.new],
                        ["Returning", data.returning[i], colors.returning],
                      ].map(([label, v, c]) => (
                        <div key={label} className="mt-1 flex justify-between text-[#6B6B63]">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                            {label}
                          </span>
                          <span className="font-medium tabular-nums text-[#2A2A28]">{formatNumber(v)}</span>
                        </div>
                      ))}
                      <div className="mt-1.5 flex justify-between border-t border-[#EFECE5] pt-1.5 text-[#6B6B63]">
                        <span>Total</span>
                        <span className="font-medium tabular-nums text-[#2A2A28]">{formatNumber(totals[i])}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-around gap-3 px-2">
            {months.map((m) => (
              <span key={m} className="w-full max-w-[44px] text-center text-[11px] text-[#A6A69C]">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
