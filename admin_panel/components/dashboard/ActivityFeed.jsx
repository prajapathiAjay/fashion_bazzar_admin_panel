import { ShoppingBag, Star, AlertTriangle, UserPlus, Sparkles } from "lucide-react";

const ICONS = {
  order: ShoppingBag,
  review: Star,
  stock: AlertTriangle,
  customer: UserPlus,
  product: Sparkles,
};

export default function ActivityFeed({ items }) {
  return (
    <ol className="relative space-y-5">
      {/* Timeline rail */}
      <span className="absolute bottom-2 left-[15px] top-2 w-px bg-[#EFECE5]" aria-hidden="true" />
      {items.map((a, i) => {
        const Icon = ICONS[a.type];
        return (
          <li key={i} className="relative flex gap-3">
            <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E8E4DC] bg-white text-[#7A1F2B]">
              <Icon size={14} strokeWidth={1.75} />
            </span>
            <div className="pt-1 leading-tight">
              <p className="text-sm text-[#2A2A28]">{a.text}</p>
              <p className="mt-1 text-xs text-[#A6A69C]">{a.time}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
