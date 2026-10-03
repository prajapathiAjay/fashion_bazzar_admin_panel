"use client";

import React, { useRef, useState } from "react";

/**
 * CategoryForm
 *
 * Shared form for both creating and editing a category.
 * Pass `initialValues` to switch it into edit mode (pre-fills fields,
 * changes heading/button copy). Omit it for create/add mode.
 *
 * @param {object} [initialValues] - existing category to edit; omit for "add" mode
 * @param {(category: object) => void} [onSubmit] - receives the validated category object
 * @param {() => void} [onCancel]
 */
const NAME_MAX = 50;
const DESC_MAX = 300;
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

const emptyCategory = {
  categoryName: "",
  description: "",
  isActive: true,
  image: null,
  imagePreview: null,
  imageFile: null,
};

const CategoryForm = ({ initialValues, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialValues);
  const fileInputRef = useRef(null);

  const [category, setCategory] = useState({
    ...emptyCategory,
    ...initialValues,
    imagePreview: initialValues?.image ?? null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleChange = (field, max) => (e) => {
    const value = max ? e.target.value.slice(0, max) : e.target.value;
    setCategory((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const loadImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please choose an image file" }));
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      setErrors((prev) => ({ ...prev, image: "Image must be 5MB or smaller" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setCategory((prev) => ({ ...prev, imagePreview: reader.result, imageFile: file }));
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    loadImage(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setCategory((prev) => ({ ...prev, image: null, imagePreview: null, imageFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const next = {};
    if (!category.categoryName.trim()) next.categoryName = "Category name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        categoryName: category.categoryName.trim(),
        description: category.description.trim(),
        isActive: category.isActive,
        image: category.imagePreview ? category.image : null,
        imageFile: category.imageFile,
      });
      if (!isEditMode) setCategory(emptyCategory); // reset only after a fresh "add"
    } catch (err) {
      setErrors({ form: err?.data?.message || err?.message || "Failed to save category" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-4 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm";
  const cardHeaderClass = "flex items-center gap-3 border-b border-gray-100 px-5 py-4";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  const CardIcon = ({ children }) => (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
      {children}
    </span>
  );

  const submitLabel = submitting ? "Saving..." : isEditMode ? "Save changes" : "Save category";

  const Spinner = () => (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );

  const ActionButtons = () => (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Spinner />}
        {submitLabel}
      </button>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl pb-24">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
            <button type="button" onClick={onCancel} className="hover:text-indigo-600">
              Categories
            </button>
            <span>/</span>
            <span className="font-medium text-gray-700">
              {isEditMode ? "Edit" : "New"}
            </span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {isEditMode ? "Edit category" : "Add new category"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Update the details below and save your changes."
              : "Group your products so shoppers can find them faster."}
          </p>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <ActionButtons />
        </div>
      </div>

      {errors.form && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 102 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic information */}
          <section className={cardClass}>
            <div className={cardHeaderClass}>
              <CardIcon>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 011.41.59l7 7a2 2 0 010 2.82l-7 7a2 2 0 01-2.82 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </CardIcon>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Basic information</h2>
                <p className="text-xs text-gray-500">Name and describe this category</p>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Category name <span className="text-red-500">*</span>
                  </label>
                  <span className="mb-1.5 text-xs text-gray-400">
                    {category.categoryName.length}/{NAME_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  value={category.categoryName}
                  onChange={handleChange("categoryName", NAME_MAX)}
                  placeholder="e.g. Shoes"
                  className={inputClass("categoryName")}
                  autoFocus
                />
                {errors.categoryName && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.categoryName}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Description</label>
                  <span className="mb-1.5 text-xs text-gray-400">
                    {category.description.length}/{DESC_MAX}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={category.description}
                  onChange={handleChange("description", DESC_MAX)}
                  placeholder="e.g. The best shoes for every occasion — sneakers, boots, formals and more."
                  className={`${inputClass("description")} resize-none`}
                />
              </div>
            </div>
          </section>

          {/* Image */}
          <section className={cardClass}>
            <div className={cardHeaderClass}>
              <CardIcon>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.59-4.59a2 2 0 012.82 0L16 16m-2-2l1.59-1.59a2 2 0 012.82 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </CardIcon>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Category image</h2>
                <p className="text-xs text-gray-500">Optional · shown on the storefront category tile</p>
              </div>
            </div>

            <div className="p-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => loadImage(e.target.files?.[0])}
              />

              {category.imagePreview ? (
                <div className="group relative overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={category.imagePreview}
                    alt="Category preview"
                    className="h-64 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-800 shadow hover:bg-gray-100"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white shadow hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition ${
                    dragging
                      ? "border-indigo-500 bg-indigo-50"
                      : errors.image
                      ? "border-red-300 bg-red-50/40"
                      : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40"
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </span>
                  <div className="text-center">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG or WEBP · up to 5MB</p>
                  </div>
                </div>
              )}
              {errors.image && <p className="mt-2 text-xs text-red-500">{errors.image}</p>}
            </div>
          </section>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Status */}
          <section className={cardClass}>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Visibility</h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {category.isActive
                      ? "Visible to shoppers on the store"
                      : "Hidden from the store"}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={category.isActive}
                  onClick={() => setCategory((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-indigo-100 ${
                    category.isActive ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      category.isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <span
                className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  category.isActive
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    category.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </section>

          {/* Live preview */}
          <section className={`${cardClass} lg:sticky lg:top-6`}>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Live preview</h2>
              <p className="text-xs text-gray-500">How the tile looks on your store</p>
            </div>
            <div className="p-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                {category.imagePreview ? (
                  <img
                    src={category.imagePreview}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-12 w-12 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {!category.isActive && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                    Hidden
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="truncate text-lg font-semibold text-white">
                    {category.categoryName.trim() || "Category name"}
                  </h3>
                  <p className="mt-0.5 line-clamp-2 text-xs text-white/80">
                    {category.description.trim() || "Your category description will appear here."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky footer actions (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <ActionButtons />
      </div>
    </form>
  );
};

export default CategoryForm;
