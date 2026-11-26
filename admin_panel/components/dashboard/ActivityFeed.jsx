import { ShoppingBag, Star, UserPlus } from "lucide-react";

const ICONS = {
  order: ShoppingBag,
  review: Star,
  customer: UserPlus,
};

// "12 min ago", "3 hr ago", "2 days ago", then the date
const timeAgo = (value) => {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

// Latest orders, reviews and sign-ups (from /admin/stats/dashboard -> activity)
export default function ActivityFeed({ items }) {
  return (
    <ol className="relative space-y-5">
      {/* Timeline rail */}
      <span className="absolute bottom-2 left-[15px] top-2 w-px bg-shimmer" aria-hidden="true" />
      {items.map((a, i) => {
        const Icon = ICONS[a.type] ?? ShoppingBag;
        return (
          <li key={i} className="relative flex gap-3">
            <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-brand">
              <Icon size={14} strokeWidth={1.75} />
            </span>
            <div className="pt-1 leading-tight">
              <p className="text-sm text-ink">{a.text}</p>
              <p suppressHydrationWarning className="mt-1 text-xs text-subtle">
                {timeAgo(a.at)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
