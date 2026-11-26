import {
  IndianRupee,
  ShoppingCart,
  UserPlus,
  Receipt,
  Users,
  Repeat,
  XCircle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatNumber } from "./format";

const ICONS = {
  revenue: IndianRupee,
  orders: ShoppingCart,
  customers: UserPlus,
  aov: Receipt,
  buyers: Users,
  returning: Repeat,
  cancelled: XCircle,
  items: Package,
};

const FORMATTERS = {
  currency: formatCurrency,
  number: formatNumber,
  percent: (v) => `${v}%`,
  decimal: (v) => v.toFixed(1),
};

function Sparkline({ data }) {
  if (!data || data.length < 2) return null;
  const w = 100;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 2 - ((v - min) / span) * (h - 4)]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-8 w-24" aria-hidden="true">
      <path d={`${line} L${w},${h} L0,${h} Z`} fill="#7B2D3D" fillOpacity="0.07" />
      <path d={line} fill="none" stroke="#7B2D3D" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default function StatCard({ kpi, rangeLabel }) {
  const Icon = ICONS[kpi.key];
  // change is null when there's nothing to compare: no data before, or the previous value was 0
  const hasChange = kpi.change !== null && kpi.change !== undefined;
  // older API responses have no hasPrevious: treat a missing change as "no data"
  const hasPrevious = kpi.hasPrevious ?? hasChange;
  const unit = kpi.changeUnit === "pts" ? " pts" : "%";
  const up = kpi.change >= 0;
  // For metrics like return rate, going down is the good direction
  const good = kpi.invert ? !up : up;
  const value = FORMATTERS[kpi.format](kpi.value);

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted" title={kpi.hint}>
          {kpi.label}
          {kpi.hint && <span className="ml-1 cursor-help text-subtle" aria-label={kpi.hint}>ⓘ</span>}
        </p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist text-brand">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          {hasChange ? (
            <>
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
              good ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
            }`}
          >
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(kpi.change)}{unit}
          </span>
          <span className="text-subtle">vs prev. {rangeLabel}</span>
            </>
          ) : hasPrevious ? (
            <span className="text-subtle">Up from 0 in the previous {rangeLabel}</span>
          ) : (
            <span className="text-subtle">No data for the previous {rangeLabel}</span>
          )}
        </div>
        <Sparkline data={kpi.spark} />
      </div>
    </div>
  );
}
