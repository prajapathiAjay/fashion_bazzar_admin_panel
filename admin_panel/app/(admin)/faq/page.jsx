"use client";

import { useState } from "react";
import { ChevronDown, CircleCheck, FilePen, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import ActionsMenu from "@/components/admin/ActionsMenu";
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
} from "@/lib/api/faqsApi";

const ALL = "All topics";

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

export default function Faqs() {
  const { data, isLoading, error: loadError } = useGetFaqsQuery();
  const [createFaq, { isLoading: creating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: deletingFaq }] = useDeleteFaqMutation();

  const topics = data?.topics ?? [];
  const faqs = data?.faqs ?? [];
  const emptyForm = { topic: topics[0] ?? "", question: "", answer: "" };

  const [topic, setTopic] = useState(ALL);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = adding a new question
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  if (isLoading) return <p className="text-muted">Loading FAQs...</p>;
  if (loadError) return <p className="text-danger">Failed to load FAQs</p>;

  const term = search.trim().toLowerCase();
  const visible = faqs.filter(
    (f) =>
      (topic === ALL || f.topic === topic) &&
      (!term || f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term))
  );
  const publishedCount = faqs.filter((f) => f.isPublished).length;

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const openAdd = () => {
    if (showForm) return closeForm();
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (faq) => {
    setForm({ topic: faq.topic, question: faq.question, answer: faq.answer });
    setEditingId(faq._id);
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { topic: form.topic, question: form.question.trim(), answer: form.answer.trim() };
    if (!body.question || !body.answer) return setError("Write both the question and the answer.");
    setError("");
    try {
      if (editingId) {
        await updateFaq({ id: editingId, ...body }).unwrap();
        setOpenId(editingId);
      } else {
        const created = await createFaq({ ...body, isPublished: false }).unwrap();
        setOpenId(created?.data?._id ?? null);
      }
      closeForm();
    } catch (err) {
      setError(err?.data?.message || "Could not save the question.");
    }
  };

  const togglePublished = async (faq) => {
    try {
      await updateFaq({ id: faq._id, isPublished: !faq.isPublished }).unwrap();
    } catch (err) {
      window.alert(err?.data?.message || "Could not change the status.");
    }
  };

  const handleDelete = async (faq) => {
    // one delete at a time (a double click would send a second DELETE)
    if (deletingFaq) return;
    if (!window.confirm(`Delete "${faq.question}"?`)) return;
    try {
      await deleteFaq(faq._id).unwrap();
      if (editingId === faq._id) closeForm();
    } catch (err) {
      window.alert(err?.data?.message || "Could not delete the question.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">Help centre</p>
          <h1 className="mt-1 text-3xl tracking-tight text-ink">FAQs</h1>
          <p className="mt-1 text-sm text-muted">
            {faqs.length} questions · {publishedCount} published · {faqs.length - publishedCount} draft
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "Add FAQ"}
        </button>
      </div>

      <p className="mt-4 text-sm text-muted">
        Only <span className="font-medium text-ink">published</span> questions appear on the website&apos;s Help centre.
        New questions start as drafts.
      </p>

      {/* Add / edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-xl border border-line bg-white p-5">
          <h2 className="text-[15px] font-semibold text-ink">{editingId ? "Edit question" : "New question"}</h2>
          <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
            <label className="block text-sm font-medium text-ink-soft">
              Topic
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className={`${inputClass} mt-1.5`}
              >
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink-soft">
              Question
              <input
                required
                maxLength={160}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="e.g. Do you ship outside India?"
                className={`${inputClass} mt-1.5`}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-ink-soft">
            Answer
            <textarea
              required
              rows={3}
              maxLength={600}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Write a short, clear answer."
              className={`${inputClass} mt-1.5 resize-none`}
            />
            <span className="mt-1 block text-right text-xs text-subtle">{form.answer.length}/600</span>
          </label>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-ink hover:bg-mist"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || updating}
              className="rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {creating || updating ? "Saving…" : editingId ? "Save changes" : "Add as draft"}
            </button>
          </div>
        </form>
      )}

      {/* Topic tabs + search */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[ALL, ...topics].map((t) => {
            const count = t === ALL ? faqs.length : faqs.filter((f) => f.topic === t).length;
            const active = topic === t;
            return (
              <button
                type="button"
                key={t}
                onClick={() => setTopic(t)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-line-strong bg-white text-muted hover:border-line-hover hover:text-ink"
                }`}
              >
                {t} <span className={active ? "text-white/70" : "text-subtle"}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block w-full sm:w-64">
          <span className="sr-only">Search questions</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className={`${inputClass} pl-9`}
          />
        </label>
      </div>

      {/* Questions */}
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
        {visible.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-subtle">
            {faqs.length === 0 ? "No questions yet. Use “Add FAQ” to write the first one." : "No questions match."}
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((faq) => {
              const open = openId === faq._id;
              return (
                <li key={faq._id}>
                  {/* The row: the question opens the answer; the actions menu sits beside
                      the status so a question can be changed without opening it */}
                  <div className="flex items-center gap-2 pr-3 transition-colors hover:bg-snow">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : faq._id)}
                      aria-expanded={open}
                      className="flex min-w-0 flex-1 items-center gap-4 py-4 pl-5 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-ink">{faq.question}</span>
                        <span className="mt-0.5 block text-xs text-subtle">
                          {faq.topic} · Updated{" "}
                          {new Date(faq.updatedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          faq.isPublished ? "bg-success-50 text-success" : "bg-sun-50 text-ink-soft"
                        }`}
                      >
                        {faq.isPublished ? "Published" : "Draft"}
                      </span>
                    </button>

                    <ActionsMenu
                      label={`Actions for "${faq.question}"`}
                      items={[
                        { label: "Edit", icon: Pencil, onClick: () => openEdit(faq) },
                        {
                          label: faq.isPublished ? "Move to draft" : "Publish",
                          icon: faq.isPublished ? FilePen : CircleCheck,
                          onClick: () => togglePublished(faq),
                        },
                        { label: "Delete", icon: Trash2, danger: true, onClick: () => handleDelete(faq) },
                      ]}
                    />

                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : faq._id)}
                      aria-label={open ? "Hide answer" : "Show answer"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-mist hover:text-ink"
                    >
                      <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {open && (
                    <p className="max-w-3xl whitespace-pre-wrap px-5 pb-5 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
