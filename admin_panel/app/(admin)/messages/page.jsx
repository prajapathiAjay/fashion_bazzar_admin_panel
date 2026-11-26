"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Inbox, Mail, RotateCcw, Search, Trash2 } from "lucide-react";
import {
  useDeleteMessageMutation,
  useGetMessagesQuery,
  useSetMessageResolvedMutation,
} from "@/lib/api/messagesApi";
import { formatDateTime } from "@/components/orders/orderUtils";

// quick views at the top of the list ("Open" first: that's the work to do)
const VIEWS = [
  { key: "open", label: "Open" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
];

const matchesView = (m, view) => {
  if (view === "open") return !m.isResolved;
  if (view === "resolved") return m.isResolved;
  return true;
};

// One message from the Contact page
function MessageCard({ msg }) {
  const [setResolved, { isLoading: saving }] = useSetMessageResolvedMutation();
  const [deleteMessage, { isLoading: deleting }] = useDeleteMessageMutation();
  const [error, setError] = useState("");

  const toggleResolved = async () => {
    setError("");
    try {
      await setResolved({ id: msg._id, isResolved: !msg.isResolved }).unwrap();
    } catch (err) {
      setError(err?.data?.message || "Could not update the message");
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the message from ${msg.name}? This can't be undone.`)) return;
    setError("");
    try {
      await deleteMessage(msg._id).unwrap();
    } catch (err) {
      setError(err?.data?.message || "Could not delete the message");
    }
  };

  // opens the admin's email app with the customer, subject and their message quoted
  const replyHref = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(`Re: ${msg.topic}`)}&body=${encodeURIComponent(
    `\n\n---\nOn ${formatDateTime(msg.createdAt)}, ${msg.name} wrote:\n${msg.message}`
  )}`;

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-sm ${msg.isResolved ? "border-line opacity-75" : "border-line-strong"}`}
    >
      <header className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 leading-tight">
          <p className="font-semibold text-ink">{msg.name}</p>
          <a href={`mailto:${encodeURIComponent(msg.email)}`} className="text-sm text-muted hover:text-brand hover:underline">
            {msg.email}
          </a>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-medium text-brand">{msg.topic}</span>
          {msg.isResolved ? (
            <span className="rounded-full bg-mist px-2.5 py-0.5 font-medium text-muted">Resolved</span>
          ) : (
            <span className="rounded-full bg-sun/20 px-2.5 py-0.5 font-medium text-ink">Open</span>
          )}
          <span className="text-subtle">{formatDateTime(msg.createdAt)}</span>
        </div>
      </header>

      {msg.orderId && (
        <p className="mt-3 text-xs text-muted">
          Order ID: <span className="font-mono text-ink-soft">{msg.orderId}</span>
        </p>
      )}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{msg.message}</p>

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <a
          href={replyHref}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
        >
          <Mail size={14} /> Reply by email
        </a>
        <button
          type="button"
          onClick={toggleResolved}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md border border-line-strong bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-mist hover:text-ink disabled:opacity-60"
        >
          {msg.isResolved ? (
            <>
              <RotateCcw size={14} /> Reopen
            </>
          ) : (
            <>
              <CheckCircle2 size={14} /> Mark resolved
            </>
          )}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={deleting}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10 disabled:opacity-60"
        >
          <Trash2 size={14} /> Delete
        </button>
      </footer>
    </article>
  );
}

export default function MessagesPage() {
  const { data: messages = [], isLoading, error } = useGetMessagesQuery();
  const [view, setView] = useState("open");
  const [search, setSearch] = useState("");

  // search by name, email, topic, order ID or words in the message
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages
      .filter((m) => matchesView(m, view))
      .filter(
        (m) =>
          !q ||
          [m.name, m.email, m.topic, m.orderId, m.message].filter(Boolean).some((t) => t.toLowerCase().includes(q))
      );
  }, [messages, view, search]);

  if (isLoading) return <p className="text-muted">Loading messages...</p>;
  if (error) return <p className="text-danger">Failed to load messages</p>;

  return (
    <>
      {/* Heading, views and search */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="text-base font-semibold text-ink">Messages</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              aria-pressed={view === v.key}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                view === v.key ? "bg-brand text-white" : "bg-white text-ink-soft ring-1 ring-line-strong hover:bg-mist"
              }`}
            >
              {v.label} <span className="opacity-70">{messages.filter((m) => matchesView(m, v.key)).length}</span>
            </button>
          ))}
        </div>

        <label className="relative ml-auto">
          <span className="sr-only">Search messages</span>
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, email, topic or words"
            className="h-9 w-64 rounded-md border border-line-strong bg-white pl-8 pr-3 text-sm text-ink placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
            <Inbox size={20} />
          </span>
          <p className="mt-3 font-medium text-ink">No messages yet</p>
          <p className="mt-1 text-sm text-muted">When shoppers use the Contact page, their messages show up here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-line bg-white px-6 py-12 text-center text-sm text-muted">
          {view === "open" && !search ? "All caught up — no open messages." : "No messages match these filters."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <MessageCard key={m._id} msg={m} />
          ))}
        </div>
      )}
    </>
  );
}
