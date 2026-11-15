"use client";

import { useState } from "react";
import { ChevronDown, CircleCheck, FilePen, Plus, Search, Trash2, X } from "lucide-react";
import ActionsMenu from "@/components/admin/ActionsMenu";
import { DUMMY_FAQS, FAQ_TOPICS } from "@/components/faq/faqData";

const ALL = "All topics";
const emptyForm = { topic: FAQ_TOPICS[0], question: "", answer: "" };

const inputClass =
  "w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15";

export default function Faqs() {
  // Dummy data kept in state: adding, hiding and deleting work on screen,
  // but nothing is saved. A page refresh brings the original list back.
  const [faqs, setFaqs] = useState(DUMMY_FAQS);
  const [topic, setTopic] = useState(ALL);
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(DUMMY_FAQS[0].id);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const term = search.trim().toLowerCase();
  const visible = faqs.filter(
    (f) =>
      (topic === ALL || f.topic === topic) &&
      (!term || f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term))
  );
  const publishedCount = faqs.filter((f) => f.isPublished).length;

  const handleAdd = (e) => {
    e.preventDefault();
    const question = form.question.trim();
    const answer = form.answer.trim();
    if (!question || !answer) return;
    const id = `faq-${Date.now()}`;
    setFaqs((list) => [
      { id, topic: form.topic, question, answer, isPublished: false, updatedAt: new Date().toISOString().slice(0, 10) },
      ...list,
    ]);
    setOpenId(id);
    setForm(emptyForm);
    setShowForm(false);
  };

  const togglePublished = (id) =>
    setFaqs((list) => list.map((f) => (f.id === id ? { ...f, isPublished: !f.isPublished } : f)));

  const handleDelete = (faq) => {
    if (!window.confirm(`Delete "${faq.question}"?`)) return;
    setFaqs((list) => list.filter((f) => f.id !== faq.id));
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
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "Add FAQ"}
        </button>
      </div>

      <p className="mt-4 rounded-lg border border-sun/40 bg-sun-50 px-4 py-2.5 text-sm text-ink-soft">
        Sample data: changes on this page are not saved yet and reset when you refresh.
      </p>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="mt-4 space-y-4 rounded-xl border border-line bg-white p-5">
          <h2 className="text-[15px] font-semibold text-ink">New question</h2>
          <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
            <label className="block text-sm font-medium text-ink-soft">
              Topic
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className={`${inputClass} mt-1.5`}
              >
                {FAQ_TOPICS.map((t) => (
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
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setShowForm(false);
              }}
              className="rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-ink hover:bg-mist"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Add as draft
            </button>
          </div>
        </form>
      )}

      {/* Topic tabs + search */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[ALL, ...FAQ_TOPICS].map((t) => {
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
          <p className="px-5 py-12 text-center text-sm text-subtle">No questions match.</p>
        ) : (
          <ul className="divide-y divide-line">
            {visible.map((faq) => {
              const open = openId === faq.id;
              return (
                <li key={faq.id}>
                  {/* The row: the question opens the answer; the delete button sits beside
                      the status so a question can be removed without opening it */}
                  <div className="flex items-center gap-2 pr-3 transition-colors hover:bg-snow">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : faq.id)}
                      aria-expanded={open}
                      className="flex min-w-0 flex-1 items-center gap-4 py-4 pl-5 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-medium text-ink">{faq.question}</span>
                        <span className="mt-0.5 block text-xs text-subtle">
                          {faq.topic} · Updated {new Date(faq.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
                        {
                          label: faq.isPublished ? "Move to draft" : "Publish",
                          icon: faq.isPublished ? FilePen : CircleCheck,
                          onClick: () => togglePublished(faq.id),
                        },
                        { label: "Delete", icon: Trash2, danger: true, onClick: () => handleDelete(faq) },
                      ]}
                    />

                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : faq.id)}
                      aria-label={open ? "Hide answer" : "Show answer"}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-mist hover:text-ink"
                    >
                      <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {open && (
                    <p className="max-w-3xl px-5 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
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
