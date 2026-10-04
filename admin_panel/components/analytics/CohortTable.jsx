import { formatNumber } from "@/components/dashboard/format";
import { rampStep } from "./ramp";

export default function CohortTable({ cohorts }) {
  const months = Math.max(...cohorts.map((c) => c.retention.length));
  // Scale colour on months 1+ only; month 0 is always 100% and would flatten the ramp
  const later = cohorts.flatMap((c) => c.retention.slice(1));
  const min = Math.min(...later);
  const max = Math.max(...later);

  return (
    <div className="-mx-5 -mb-5 overflow-x-auto px-5 pb-5">
      <table className="w-full min-w-[720px] border-separate text-sm" style={{ borderSpacing: 3 }}>
        <thead>
          <tr className="text-[11px] font-medium uppercase tracking-wide text-[#A6A69C]">
            <th className="pb-2 text-left font-medium">Cohort</th>
            <th className="pb-2 text-right font-medium">Customers</th>
            {Array.from({ length: months }, (_, i) => (
              <th key={i} className="pb-2 font-medium">
                {i === 0 ? "Month 0" : `M${i}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((c) => (
            <tr key={c.cohort}>
              <td className="whitespace-nowrap pr-4 text-[#2A2A28]">{c.cohort}</td>
              <td className="pr-4 text-right tabular-nums text-[#6B6B63]">{formatNumber(c.size)}</td>
              {Array.from({ length: months }, (_, i) => {
                const v = c.retention[i];
                if (v === undefined) return <td key={i} className="h-9 rounded-[4px] bg-[#FAFAF8]" />;
                const { bg, fg } = i === 0 ? { bg: "#F3F0EA", fg: "#6B6B63" } : rampStep(v, min, max);
                return (
                  <td
                    key={i}
                    title={`${c.cohort} · month ${i}: ${v}% ordered again`}
                    className="h-9 min-w-[64px] rounded-[4px] text-center text-xs tabular-nums"
                    style={{ backgroundColor: bg, color: fg }}
                  >
                    {v}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
