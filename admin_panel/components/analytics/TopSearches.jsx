import { Search } from "lucide-react";
import { formatNumber } from "@/components/dashboard/format";

export default function TopSearches({ terms }) {
  return (
    <ul className="divide-y divide-[#EFECE5]">
      {terms.map((t) => (
        <li key={t.term} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
          <span className="flex items-center gap-2.5 text-sm text-[#2A2A28]">
            <Search size={13} strokeWidth={1.75} className="text-[#A6A69C]" />
            {t.term}
          </span>
          <span className="text-xs tabular-nums text-[#6B6B63]">{formatNumber(t.count)}</span>
        </li>
      ))}
    </ul>
  );
}
