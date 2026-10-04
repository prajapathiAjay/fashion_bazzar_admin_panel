"use client";

import { useEffect, useRef, useState } from "react";
import { formatCompactINR, formatCurrency, niceTicks } from "./format";

const HEIGHT = 280;
const PAD = { top: 12, right: 12, bottom: 28, left: 56 };

export default function RevenueChart({ series }) {
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState(null);

  // Draw in real pixels so text never stretches
  useEffect(() => {
    const el = wrapRef.current;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { labels, current, previous } = series;
  // Range switches can shrink the series; drop a hover index that no longer exists
  const active = hover !== null && hover < labels.length ? hover : null;
  const ticks = niceTicks(Math.max(...current, ...previous));
  const yMax = ticks[ticks.length - 1];
  const innerW = Math.max(width - PAD.left - PAD.right, 0);
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const x = (i) => PAD.left + (i / (labels.length - 1)) * innerW;
  const y = (v) => PAD.top + innerH - (v / yMax) * innerH;
  const path = (data) => data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  // Thin out x labels on dense ranges
  const labelEvery = Math.ceil(labels.length / Math.max(Math.floor(innerW / 64), 1));

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left - PAD.left) / innerW;
    const i = Math.round(rel * (labels.length - 1));
    setHover(i >= 0 && i < labels.length ? i : null);
  };

  const totalCurrent = current.reduce((a, b) => a + b, 0);
  const totalPrev = previous.reduce((a, b) => a + b, 0);
  const growth = (((totalCurrent - totalPrev) / totalPrev) * 100).toFixed(1);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-[#2A2A28] tabular-nums">
            {formatCurrency(totalCurrent)}
          </p>
          <p className="mt-0.5 text-xs text-[#8A8A80]">
            <span className={`font-medium ${growth >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {growth >= 0 ? "+" : ""}
              {growth}%
            </span>{" "}
            compared to previous period
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#6B6B63]">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded bg-[#7A1F2B]" /> This period
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-[#B8B2A6]" /> Previous period
          </span>
        </div>
      </div>

      <div ref={wrapRef} className="relative" style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
            role="img"
            aria-label="Revenue over time, this period versus previous period"
          >
            <defs>
              <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A1F2B" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#7A1F2B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke="#EFECE5" />
                <text x={PAD.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="fill-[#A6A69C] text-[11px]">
                  {formatCompactINR(t)}
                </text>
              </g>
            ))}

            {labels.map((l, i) =>
              i % labelEvery === 0 ? (
                <text key={i} x={x(i)} y={HEIGHT - 8} textAnchor="middle" className="fill-[#A6A69C] text-[11px]">
                  {l}
                </text>
              ) : null
            )}

            <path d={path(previous)} fill="none" stroke="#B8B2A6" strokeWidth="2" strokeDasharray="4 4" />
            <path d={`${path(current)} L${x(labels.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#rev-fill)" />
            <path d={path(current)} fill="none" stroke="#7A1F2B" strokeWidth="2" strokeLinejoin="round" />

            {active !== null && (
              <g>
                <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + innerH} stroke="#D6D1C6" />
                <circle cx={x(active)} cy={y(previous[active])} r="4" fill="#B8B2A6" stroke="#fff" strokeWidth="2" />
                <circle cx={x(active)} cy={y(current[active])} r="5" fill="#7A1F2B" stroke="#fff" strokeWidth="2" />
              </g>
            )}
          </svg>
        )}

        {active !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-[170px] rounded-lg border border-[#E8E4DC] bg-white px-3 py-2.5 text-xs shadow-lg"
            style={{
              left: x(active),
              transform: `translateX(${x(active) > width / 2 ? "calc(-100% - 12px)" : "12px"})`,
            }}
          >
            <p className="mb-1.5 font-medium text-[#2A2A28]">{labels[active]}</p>
            <div className="flex items-center justify-between gap-4 text-[#6B6B63]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#7A1F2B]" /> This period
              </span>
              <span className="font-medium text-[#2A2A28] tabular-nums">{formatCurrency(current[active])}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-4 text-[#6B6B63]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#B8B2A6]" /> Previous
              </span>
              <span className="font-medium text-[#2A2A28] tabular-nums">{formatCurrency(previous[active])}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
