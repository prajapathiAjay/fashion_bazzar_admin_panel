import {
  IndianRupee,
  ShoppingCart,
  UserPlus,
  Receipt,
  MousePointerClick,
  Target,
  Repeat,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatNumber } from "./format";

const ICONS = {
  revenue: IndianRupee,
  orders: ShoppingCart,
  customers: UserPlus,
  aov: Receipt,
  sessions: MousePointerClick,
  conversion: Target,
  returning: Repeat,
  refund: RotateCcw,
};

const FORMATTERS = {
  currency: formatCurrency,
  number: formatNumber,
  percent: (v) => `${v}%`,
};

function Sparkline({ data }) {
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
  const up = kpi.change >= 0;
  // For metrics like return rate, going down is the good direction
  const good = kpi.invert ? !up : up;
  const value = FORMATTERS[kpi.format](kpi.value);

  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{kpi.label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist text-brand">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>

      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
              good ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
            }`}
          >
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(kpi.change)}%
          </span>
          <span className="text-subtle">vs prev. {rangeLabel}</span>
        </div>
        <Sparkline data={kpi.spark} />
      </div>
    </div>
  );
}
