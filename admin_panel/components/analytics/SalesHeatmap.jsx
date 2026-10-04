"use client";

import { useState } from "react";
import { RAMP, rampStep } from "./ramp";

export default function SalesHeatmap({ data }) {
  const [hover, setHover] = useState(null);
  const flat = data.values.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);

  // Find the busiest slot for the summary line
  let peak = { d: 0, s: 0 };
  data.values.forEach((row, d) =>
    row.forEach((v, s) => {
      if (v > data.values[peak.d][peak.s]) peak = { d, s };
    })
  );

  const active = hover ?? peak;

  return (
    <div>
      <p className="mb-4 text-xs text-[#8A8A80]">
        {hover ? "Selected" : "Peak"}:{" "}
        <span className="font-medium text-[#2A2A28]">
          {data.days[active.d]}, {data.slots[active.s]}–{data.slots[(active.s + 1) % data.slots.length]}
        </span>{" "}
        · <span className="font-medium tabular-nums text-[#2A2A28]">{data.values[active.d][active.s]}</span> orders
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-separate" style={{ borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="w-10" />
              {data.slots.map((s) => (
                <th key={s} className="pb-1 text-[11px] font-normal text-[#A6A69C]">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody onMouseLeave={() => setHover(null)}>
            {data.days.map((day, d) => (
              <tr key={day}>
                <th className="pr-2 text-left text-[11px] font-normal text-[#A6A69C]">{day}</th>
                {data.values[d].map((v, s) => {
                  const { bg, fg } = rampStep(v, min, max);
                  const isActive = hover && hover.d === d && hover.s === s;
                  return (
                    <td
                      key={s}
                      onMouseEnter={() => setHover({ d, s })}
                      title={`${day} ${data.slots[s]}: ${v} orders`}
                      className={`h-9 rounded-[4px] text-center text-[11px] tabular-nums transition-shadow ${
                        isActive ? "ring-2 ring-[#2A2A28] ring-offset-1" : ""
                      }`}
                      style={{ backgroundColor: bg, color: fg }}
                    >
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scale legend */}
      <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-[#A6A69C]">
        <span>Fewer</span>
        <div className="flex gap-[2px]">
          {RAMP.map((c) => (
            <span key={c} className="h-2.5 w-5 rounded-[2px]" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span>More orders</span>
      </div>
    </div>
  );
}
