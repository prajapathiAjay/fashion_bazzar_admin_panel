"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, CornerDownRight, Eye, EyeOff, MessageSquareReply, Pencil, Star, ThumbsUp, Trash2 } from "lucide-react";
import ActionsMenu from "@/components/admin/ActionsMenu";
import { useDeleteReviewMutation, useModerateReviewMutation } from "@/lib/api/reviewsApi";

const REPLY_MAX = 1000;

export function Stars({ value, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? "fill-sun text-sun" : "fill-line text-line"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");

const customerName = (u) => {
  if (!u) return "Deleted user";
  return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "Shopper";
};

// One review with moderation actions: reply (inline), hide / show, delete
export default function ReviewCard({ review: r, onNotice }) {
  const [moderate, { isLoading: saving }] = useModerateReviewMutation();
  const [deleteReview, { isLoading: deleting }] = useDeleteReviewMutation();
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState(r.reply?.text ?? "");
  const [expanded, setExpanded] = useState(false);

  const save = async (changes, okText) => {
    try {
      await moderate({ id: r._id, ...changes }).unwrap();
      onNotice?.({ type: "success", text: okText });
      return true;
    } catch (err) {
      onNotice?.({ type: "error", text: err?.data?.message || "Could not update the review" });
      return false;
    }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    if (await save({ reply: draft }, r.reply?.text ? "Reply updated" : "Reply posted")) setReplying(false);
  };

  const removeReply = async () => {
    if (!window.confirm("Remove the store's reply from this review?")) return;
    if (await save({ reply: "" }, "Reply removed")) setDraft("");
  };

  const toggleHidden = () =>
    save(
      { isHidden: !r.isHidden },
      r.isHidden ? "Review is visible in the shop again" : "Review hidden from the shop"
    );

  const remove = async () => {
    if (!window.confirm("Delete this review for good? It also stops counting in the product rating. This can't be undone.")) return;
    try {
      await deleteReview(r._id).unwrap();
      onNotice?.({ type: "success", text: "Review deleted" });
    } catch (err) {
      onNotice?.({ type: "error", text: err?.data?.message || "Could not delete the review" });
    }
  };

  const name = customerName(r.user);
  const longComment = (r.comment?.length ?? 0) > 280;
  const product = r.product;

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm transition ${
        r.isHidden ? "border-dashed border-line-strong bg-snow/60" : r.rating <= 2 ? "border-danger/25" : "border-line"
      }`}
    >
      {/* Product strip */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        {product ? (
          <Link href={`/products/${product._id}`} className="group flex min-w-0 items-center gap-3">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt="" className="h-9 w-8 shrink-0 rounded-md border border-line object-cover" />
            ) : (
              <span className="h-9 w-8 shrink-0 rounded-md bg-mist" />
            )}
            <span className="truncate text-sm font-medium text-ink-soft group-hover:text-brand">{product.name}</span>
          </Link>
        ) : (
          <span className="text-sm text-subtle">Product was deleted</span>
        )}

        <div className="flex shrink-0 items-center gap-2">
          {r.isHidden && (
            <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line-strong">
              <EyeOff size={12} /> Hidden
            </span>
          )}
          <ActionsMenu
            label={`Actions for review by ${name}`}
            items={[
              {
                label: r.reply?.text ? "Edit reply" : "Reply",
                icon: r.reply?.text ? Pencil : MessageSquareReply,
                onClick: () => {
                  setDraft(r.reply?.text ?? "");
                  setReplying(true);
                },
              },
              {
                label: r.isHidden ? "Show in shop" : "Hide from shop",
                icon: r.isHidden ? Eye : EyeOff,
                disabled: saving,
                onClick: toggleHidden,
              },
              { label: deleting ? "Deleting..." : "Delete", icon: Trash2, danger: true, disabled: deleting, onClick: remove },
            ]}
          />
        </div>
      </div>

      {/* Review */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Stars value={r.rating} />
          {r.title && <h3 className="text-sm font-semibold text-ink">{r.title}</h3>}
        </div>

        <p className={`mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft ${longComment && !expanded ? "line-clamp-4" : ""}`}>
          {r.comment}
        </p>
        {longComment && (
          <button type="button" onClick={() => setExpanded((v) => !v)} className="mt-1 text-xs font-medium text-brand hover:underline">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="font-medium text-ink-soft">{name}</span>
          {r.user?.email && <span>{r.user.email}</span>}
          <span>· {fmtDate(r.createdAt)}</span>
          {r.verifiedPurchase ? (
            <span className="inline-flex items-center gap-1 font-medium text-success">
              <BadgeCheck size={13} /> Verified purchase
            </span>
          ) : (
            <span className="text-subtle">Not a verified purchase</span>
          )}
          {r.helpful > 0 && (
            <span className="inline-flex items-center gap-1">
              <ThumbsUp size={12} /> {r.helpful} found helpful
            </span>
          )}
        </div>

        {/* Store reply (saved) */}
        {r.reply?.text && !replying && (
          <div className="mt-4 rounded-lg border-l-2 border-brand bg-brand-50/50 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                <CornerDownRight size={13} /> Reply from Fashion Bazar · {fmtDate(r.reply.repliedAt)}
              </p>
              <div className="flex gap-3 text-xs">
                <button type="button" onClick={() => setReplying(true)} className="font-medium text-ink-soft hover:text-brand">
                  Edit
                </button>
                <button type="button" onClick={removeReply} disabled={saving} className="font-medium text-danger hover:underline">
                  Remove
                </button>
              </div>
            </div>
            <p className="mt-1.5 whitespace-pre-line text-sm text-ink-soft">{r.reply.text}</p>
          </div>
        )}

        {/* Reply editor */}
        {replying && (
          <form onSubmit={submitReply} className="mt-4">
            <label htmlFor={`reply-${r._id}`} className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>Public reply (shown under the review in the shop)</span>
              <span className="text-subtle">
                {draft.length}/{REPLY_MAX}
              </span>
            </label>
            <textarea
              id={`reply-${r._id}`}
              rows={3}
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, REPLY_MAX))}
              placeholder={
                r.rating <= 2
                  ? "Sorry to hear this. Apologise, explain what you'll do, and invite them to contact support."
                  : "Thank them for the review."
              }
              className="w-full resize-y rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder-subtle shadow-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setReplying(false);
                  setDraft(r.reply?.text ?? "");
                }}
                className="rounded-lg border border-line-strong bg-white px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-snow"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !draft.trim()}
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : r.reply?.text ? "Update reply" : "Post reply"}
              </button>
            </div>
          </form>
        )}

        {!r.reply?.text && !replying && (
          <button
            type="button"
            onClick={() => setReplying(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-white px-2.5 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-mist hover:text-ink"
          >
            <MessageSquareReply size={14} /> Reply
          </button>
        )}
      </div>
    </article>
  );
}
