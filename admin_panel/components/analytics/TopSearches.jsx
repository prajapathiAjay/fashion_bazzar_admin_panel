import { Search } from "lucide-react";
import { formatNumber } from "@/components/dashboard/format";

export default function TopSearches({ terms }) {
  return (
    <ul className="divide-y divide-shimmer">
      {terms.map((t) => (
        <li key={t.term} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
          <span className="flex items-center gap-2.5 text-sm text-ink">
            <Search size={13} strokeWidth={1.75} className="text-subtle" />
            {t.term}
          </span>
          <span className="text-xs tabular-nums text-muted">{formatNumber(t.count)}</span>
        </li>
      ))}
    </ul>
  );
}
