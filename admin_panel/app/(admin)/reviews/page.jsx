"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search, X } from "lucide-react";
import Pagination from "@/components/admin/Pagination";
import ReviewCard, { Stars } from "@/components/reviews/ReviewCard";
import { useGetReviewsQuery } from "@/lib/api/reviewsApi";

const PAGE_SIZE = 10;

// quick views at the top of the list
const VIEWS = [
  { key: "all", label: "All" },
  { key: "unreplied", label: "Needs reply" },
  { key: "low", label: "Low ratings (1–2★)" },
  { key: "hidden", label: "Hidden" },
];

const SORTS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "lowest", label: "Lowest rating" },
  { key: "highest", label: "Highest rating" },
  { key: "helpful", label: "Most helpful" },
];

const matchesView = (r, view) => {
  if (view === "unreplied") return !r.isHidden && !r.reply?.text;
  if (view === "low") return r.rating <= 2;
  if (view === "hidden") return r.isHidden;
  return true;
};

const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  lowest: (a, b) => a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt),
  highest: (a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt),
  helpful: (a, b) => (b.helpful ?? 0) - (a.helpful ?? 0),
};

// A number tile; with onClick it also works as a filter button
function StatTile({ label, value, hint, tone = "text-ink", onClick, active }) {
  const body = (
    <>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone}`}>{value}</p>
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </>
  );
  if (!onClick) {
    return <div className="rounded-xl border border-line bg-white px-4 py-3 shadow-sm">{body}</div>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border bg-white px-4 py-3 text-left shadow-sm transition hover:border-line-hover ${
        active ? "border-brand ring-2 ring-brand-100" : "border-line"
      }`}
    >
      {body}
    </button>
  );
}

export default function ReviewsPage() {
  const { data: reviews = [], isLoading, error } = useGetReviewsQuery();
  const [view, setView] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(null); // 1-5 or null
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(null);

  // hide the success message after a few seconds
  useEffect(() => {
    if (notice?.type !== "success") return undefined;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  // numbers for the summary (visible reviews = what shoppers see)
  const stats = useMemo(() => {
    const visible = reviews.filter((r) => !r.isHidden);
    const dist = [5, 4, 3, 2, 1].map((star) => ({ star, count: visible.filter((r) => r.rating === star).length }));
    const avg = visible.length ? visible.reduce((s, r) => s + r.rating, 0) / visible.length : 0;
    const replied = visible.filter((r) => r.reply?.text).length;
    return {
      visibleCount: visible.length,
      avg,
      dist,
      unreplied: visible.length - replied,
      replyRate: visible.length ? Math.round((replied / visible.length) * 100) : 0,
      low: reviews.filter((r) => r.rating <= 2).length,
      hidden: reviews.length - visible.length,
      verified: visible.length ? Math.round((visible.filter((r) => r.verifiedPurchase).length / visible.length) * 100) : 0,
    };
  }, [reviews]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reviews
      .filter((r) => matchesView(r, view))
      .filter((r) => (ratingFilter ? r.rating === ratingFilter : true))
      .filter((r) => {
        if (!q) return true;
        const name = [r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ");
        return [r.title, r.comment, r.product?.name, name, r.user?.email]
          .filter(Boolean)
          .some((t) => t.toLowerCase().includes(q));
      })
      .sort(sorters[sort]);
  }, [reviews, view, ratingFilter, search, sort]);

  if (isLoading) return <p className="text-muted">Loading reviews...</p>;
  if (error) return <p className="text-danger">Failed to load reviews</p>;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const maxDist = Math.max(1, ...stats.dist.map((d) => d.count));
  const anyFilter = view !== "all" || ratingFilter || search;

  const resetPage = (fn) => (...args) => {
    fn(...args);
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Reviews</h1>
        <p className="mt-1 text-sm text-muted">
          Read what shoppers say, reply in public, and hide reviews that break the rules (spam, abuse, personal details).
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Average + distribution */}
        <section className="rounded-xl border border-line bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex items-center gap-4">
            <p className="text-4xl font-semibold text-ink">{stats.avg ? stats.avg.toFixed(1) : "—"}</p>
            <div>
              <Stars value={Math.round(stats.avg)} size={16} />
              <p className="mt-1 text-xs text-muted">
                {stats.visibleCount} {stats.visibleCount === 1 ? "review" : "reviews"} in the shop
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5">
            {stats.dist.map(({ star, count }) => (
              <li key={star}>
                <button
                  type="button"
                  onClick={resetPage(() => setRatingFilter(ratingFilter === star ? null : star))}
                  aria-pressed={ratingFilter === star}
                  className={`flex w-full items-center gap-2 rounded px-1 py-0.5 text-xs transition hover:bg-mist ${
                    ratingFilter === star ? "bg-brand-50" : ""
                  }`}
                >
                  <span className="w-6 text-right font-medium text-ink-soft">{star}★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-mist">
                    <span
                      className={`block h-full rounded-full ${star <= 2 ? "bg-danger/70" : star === 3 ? "bg-sun" : "bg-success"}`}
                      style={{ width: `${(count / maxDist) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 text-left text-muted">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Attention tiles */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <StatTile
            label="Needs reply"
            value={stats.unreplied}
            hint={`${stats.replyRate}% replied`}
            tone={stats.unreplied ? "text-pop" : "text-ink"}
            active={view === "unreplied"}
            onClick={resetPage(() => setView(view === "unreplied" ? "all" : "unreplied"))}
          />
          <StatTile
            label="Low ratings"
            value={stats.low}
            hint="1 or 2 stars"
            tone={stats.low ? "text-danger" : "text-ink"}
            active={view === "low"}
            onClick={resetPage(() => setView(view === "low" ? "all" : "low"))}
          />
          <StatTile
            label="Hidden"
            value={stats.hidden}
            hint="Not shown in the shop"
            active={view === "hidden"}
            onClick={resetPage(() => setView(view === "hidden" ? "all" : "hidden"))}
          />
          <StatTile label="Verified purchases" value={`${stats.verified}%`} hint="Reviewer bought the product" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={resetPage(() => setView(v.key))}
              aria-pressed={view === v.key}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                view === v.key ? "bg-brand text-white" : "bg-white text-ink-soft ring-1 ring-line-strong hover:bg-mist"
              }`}
            >
              {v.label}{" "}
              <span className="opacity-70">{reviews.filter((r) => matchesView(r, v.key)).length}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="relative">
            <span className="sr-only">Search reviews</span>
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Product, customer or words"
              className="h-9 w-60 rounded-md border border-line-strong bg-white pl-8 pr-3 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort reviews"
            className="h-9 rounded-md border border-line-strong bg-white px-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {anyFilter && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>
            Showing {filtered.length} of {reviews.length}
          </span>
          {ratingFilter && (
            <button
              type="button"
              onClick={resetPage(() => setRatingFilter(null))}
              className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 font-medium text-ink-soft hover:bg-line"
            >
              {ratingFilter}★ only <X size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setView("all");
              setRatingFilter(null);
              setSearch("");
              setPage(1);
            }}
            className="font-medium text-brand hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* List */}
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
            <MessageSquare size={20} />
          </span>
          <p className="mt-3 font-medium text-ink">No reviews yet</p>
          <p className="mt-1 text-sm text-muted">When shoppers review a product, it shows up here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-white px-6 py-12 text-center text-sm text-muted">
          No reviews match these filters.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleRows.map((r) => (
            <ReviewCard key={r._id} review={r} onNotice={setNotice} />
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
          <p>
            {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Result message */}
      {notice && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-[0_12px_32px_rgba(28,23,20,0.14)] ring-1 ring-black/5 ${
            notice.type === "success" ? "bg-success-50 text-success" : "bg-danger-50 text-danger"
          }`}
        >
          <p className="flex-1">{notice.text}</p>
          <button type="button" onClick={() => setNotice(null)} aria-label="Close message" className="opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
