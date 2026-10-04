"use client";

import React, { useRef, useState } from "react";
import { useGetCategoriesQuery } from "@/lib/api/categoriesApi";
import { formatCurrency } from "@/components/dashboard/format";

/**
 * ProductForm
 *
 * Shared form for both creating and editing a product.
 * Pass `initialValues` to switch it into edit mode (pre-fills fields,
 * changes heading/button copy). Omit it for create/add mode.
 *
 * onSubmit receives:
 *   { name, summary, description, brand, price, discount, stock, isActive,
 *     categories: [categoryId], sizes: [String], colors: [String],
 *     images: [url | File] } - in display order (first = cover); saved images are
 *                              URL strings, new picks are File objects for the page to upload
 *
 * @param {object} [initialValues] - existing product to edit; omit for "add" mode
 * @param {(product: object) => void} [onSubmit] - receives the validated product object
 * @param {() => void} [onCancel]
 */
const NAME_MAX = 100;
const SUMMARY_MAX = 160;
const DESC_MAX = 2000;
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const MAX_IMAGES = 8;
const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];

const emptyProduct = {
  name: "",
  summary: "",
  description: "",
  brand: "",
  price: "",
  discount: "",
  stock: "",
  isActive: true,
  categories: [],
  sizes: [],
  colors: [],
};

// Categories may arrive populated ({ _id, categoryName }) or as plain ids
const toId = (c) => (typeof c === "object" && c !== null ? c._id : c);

const isCssColor = (value) =>
  typeof CSS !== "undefined" && CSS.supports?.("color", value.toLowerCase());

const buildInitialState = (initialValues) => ({
  ...emptyProduct,
  ...initialValues,
  price: initialValues?.price ?? "",
  discount: initialValues?.discount ?? "",
  stock: initialValues?.stock ?? "",
  categories: (initialValues?.categories ?? []).map(toId),
  sizes: initialValues?.sizes ?? [],
  colors: initialValues?.colors ?? [],
});

let imageKey = 0;
const nextImageKey = () => `img-${++imageKey}`;

// ---- Presentational helpers (declared outside the form so React doesn't remount them) ----
const CardHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
    </span>
    <div>
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const FieldError = ({ message }) =>
  message ? <p className="mt-1.5 text-xs text-red-500">{message}</p> : null;

const RemoveX = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="ml-0.5 rounded p-0.5 text-current opacity-60 hover:opacity-100"
  >
    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  </button>
);

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ActionButtons = ({ onCancel, submitting, label }) => (
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
      {label}
    </button>
  </>
);

const ProductForm = ({ initialValues, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialValues);
  const fileInputRef = useRef(null);
  const { data: allCategories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const [product, setProduct] = useState(() => buildInitialState(initialValues));
  // Each image: { key, preview, url?, file? } — `url` for saved images, `file` for new picks
  const [images, setImages] = useState(() =>
    (initialValues?.images ?? []).map((url) => ({ key: nextImageKey(), preview: url, url }))
  );
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);

  const setField = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (field, max) => (e) =>
    setField(field, max ? e.target.value.slice(0, max) : e.target.value);

  // ---- Images ----
  const addFiles = (fileList) => {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setErrors((prev) => ({ ...prev, images: `You can add up to ${MAX_IMAGES} images` }));
      return;
    }

    const valid = [];
    let error;
    for (const file of files.slice(0, room)) {
      if (!file.type.startsWith("image/")) error = "Only image files are allowed";
      else if (file.size > IMAGE_MAX_BYTES) error = "Each image must be 5MB or smaller";
      else valid.push(file);
    }
    if (files.length > room) error = `Only ${room} more image(s) allowed (max ${MAX_IMAGES})`;

    setImages((prev) => [
      ...prev,
      ...valid.map((file) => ({ key: nextImageKey(), file, preview: URL.createObjectURL(file) })),
    ]);
    setErrors((prev) => ({ ...prev, images: error }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (key) => {
    setImages((prev) => {
      const target = prev.find((img) => img.key === key);
      if (target?.file) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.key !== key);
    });
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const makeCover = (key) =>
    setImages((prev) => [prev.find((img) => img.key === key), ...prev.filter((img) => img.key !== key)]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ---- Tag-style lists (sizes, colors, categories) ----
  const toggleInList = (field, value) =>
    setField(
      field,
      product[field].includes(value)
        ? product[field].filter((v) => v !== value)
        : [...product[field], value]
    );

  const addTag = (field, raw, clear) => {
    const values = raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (!values.length) return;
    const existing = product[field].map((v) => v.toLowerCase());
    const fresh = values.filter(
      (v, i) => !existing.includes(v.toLowerCase()) && values.indexOf(v) === i
    );
    setField(field, [...product[field], ...(field === "sizes" ? fresh.map((v) => v.toUpperCase()) : fresh)]);
    clear("");
  };

  const tagKeyDown = (field, value, clear) => (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field, value, clear);
    } else if (e.key === "Backspace" && !value && product[field].length) {
      setField(field, product[field].slice(0, -1));
    }
  };

  // ---- Submit ----
  const validate = () => {
    const next = {};
    const price = Number(product.price);
    const discount = product.discount === "" ? 0 : Number(product.discount);
    const stock = product.stock === "" ? 0 : Number(product.stock);

    if (!product.name.trim()) next.name = "Product name is required";
    if (!product.summary.trim()) next.summary = "Summary is required";
    if (!product.description.trim()) next.description = "Description is required";
    if (product.price === "" || Number.isNaN(price) || price < 0)
      next.price = "Enter a valid price (0 or more)";
    if (Number.isNaN(discount) || discount < 0 || discount > 100)
      next.discount = "Discount must be between 0 and 100";
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock))
      next.stock = "Enter a whole number (0 or more)";
    if (!product.categories.length) next.categories = "Pick at least one category";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        name: product.name.trim(),
        summary: product.summary.trim(),
        description: product.description.trim(),
        brand: product.brand.trim(),
        price: Number(product.price),
        discount: product.discount === "" ? 0 : Number(product.discount),
        stock: product.stock === "" ? 0 : Number(product.stock),
        isActive: product.isActive,
        categories: product.categories,
        sizes: product.sizes,
        colors: product.colors,
        images: images.map((img) => img.url ?? img.file),
      });
      if (!isEditMode) {
        // reset only after a fresh "add"
        images.forEach((img) => img.file && URL.revokeObjectURL(img.preview));
        setProduct(emptyProduct);
        setImages([]);
      }
    } catch (err) {
      setErrors({ form: err?.data?.message || err?.message || "Failed to save product" });
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Derived ----
  const priceNum = Number(product.price) || 0;
  const discountNum = Math.min(Math.max(Number(product.discount) || 0, 0), 100);
  const finalPrice = priceNum * (1 - discountNum / 100);
  const stockNum = Number(product.stock) || 0;
  const coverImage = images[0]?.preview;
  const selectedCategoryNames = allCategories
    .filter((c) => product.categories.includes(c._id))
    .map((c) => c.categoryName);

  // ---- Styles ----
  const inputClass = (field) =>
    `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-4 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  const cardClass = "rounded-xl border border-gray-200 bg-white shadow-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const chipClass = (active) =>
    `rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
        : "border-gray-300 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
    }`;

  const submitLabel = submitting ? "Saving..." : isEditMode ? "Save changes" : "Save product";

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-6xl pb-24" noValidate>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
            <button type="button" onClick={onCancel} className="hover:text-indigo-600">
              Products
            </button>
            <span>/</span>
            <span className="font-medium text-gray-700">{isEditMode ? "Edit" : "New"}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {isEditMode ? "Edit product" : "Add new product"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Update the details below and save your changes."
              : "Fill in the details below to add a new product to your catalog."}
          </p>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <ActionButtons onCancel={onCancel} submitting={submitting} label={submitLabel} />
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
            <CardHeader
              icon="M7 7h.01M7 3h5a2 2 0 011.41.59l7 7a2 2 0 010 2.82l-7 7a2 2 0 01-2.82 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
              title="Basic information"
              subtitle="Name, brand and how you describe this product"
            />

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>
                      Product name <span className="text-red-500">*</span>
                    </label>
                    <span className="mb-1.5 text-xs text-gray-400">
                      {product.name.length}/{NAME_MAX}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={product.name}
                    onChange={handleChange("name", NAME_MAX)}
                    placeholder="e.g. Classic Cotton T-Shirt"
                    className={inputClass("name")}
                    autoFocus
                  />
                  <FieldError message={errors.name} />
                </div>

                <div>
                  <label className={labelClass}>Brand</label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={handleChange("brand")}
                    placeholder="e.g. Levi's"
                    className={inputClass("brand")}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Summary <span className="text-red-500">*</span>
                  </label>
                  <span className="mb-1.5 text-xs text-gray-400">
                    {product.summary.length}/{SUMMARY_MAX}
                  </span>
                </div>
                <input
                  type="text"
                  value={product.summary}
                  onChange={handleChange("summary", SUMMARY_MAX)}
                  placeholder="One line shown on product cards, e.g. Breathable everyday tee in 100% cotton"
                  className={inputClass("summary")}
                />
                <FieldError message={errors.summary} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <span className="mb-1.5 text-xs text-gray-400">
                    {product.description.length}/{DESC_MAX}
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={product.description}
                  onChange={handleChange("description", DESC_MAX)}
                  placeholder="Fabric, fit, care instructions and anything else shoppers should know..."
                  className={`${inputClass("description")} resize-y`}
                />
                <FieldError message={errors.description} />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className={cardClass}>
            <CardHeader
              icon="M4 16l4.59-4.59a2 2 0 012.82 0L16 16m-2-2l1.59-1.59a2 2 0 012.82 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              title="Images"
              subtitle={`Up to ${MAX_IMAGES} images · the first one is the cover`}
            />

            <div className="p-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />

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
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition ${
                  images.length ? "h-32" : "h-56"
                } ${
                  dragging
                    ? "border-indigo-500 bg-indigo-50"
                    : errors.images
                    ? "border-red-300 bg-red-50/40"
                    : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/40"
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                <div className="text-center">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG or WEBP · up to 5MB each · {images.length}/{MAX_IMAGES} added
                  </p>
                </div>
              </div>
              <FieldError message={errors.images} />

              {images.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((img, i) => (
                    <li
                      key={img.key}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <img src={img.preview} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
                      {i === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Cover
                        </span>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                        {i !== 0 && (
                          <button
                            type="button"
                            onClick={() => makeCover(img.key)}
                            className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-800 shadow hover:bg-gray-100"
                          >
                            Make cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(img.key)}
                          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-medium text-white shadow hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Pricing & inventory */}
          <section className={cardClass}>
            <CardHeader
              icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              title="Pricing & inventory"
              subtitle="Base price, discount and units in stock"
            />

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={product.price}
                      onChange={handleChange("price")}
                      placeholder="0.00"
                      className={`${inputClass("price")} pl-8`}
                    />
                  </div>
                  <FieldError message={errors.price} />
                </div>

                <div>
                  <label className={labelClass}>Discount</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      inputMode="numeric"
                      value={product.discount}
                      onChange={handleChange("discount")}
                      placeholder="0"
                      className={`${inputClass("discount")} pr-9`}
                    />
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      %
                    </span>
                  </div>
                  <FieldError message={errors.discount} />
                </div>

                <div>
                  <label className={labelClass}>Stock quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={product.stock}
                    onChange={handleChange("stock")}
                    placeholder="0"
                    className={inputClass("stock")}
                  />
                  <FieldError message={errors.stock} />
                </div>
              </div>

              {priceNum > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm ring-1 ring-gray-200">
                  <span className="text-gray-600">Customer pays</span>
                  <span className="flex items-baseline gap-2">
                    {discountNum > 0 && (
                      <span className="text-xs text-gray-400 line-through">{formatCurrency(priceNum)}</span>
                    )}
                    <span className="text-base font-semibold text-gray-900">{formatCurrency(finalPrice)}</span>
                    {discountNum > 0 && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                        {discountNum}% off
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Variants */}
          <section className={cardClass}>
            <CardHeader
              icon="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              title="Variants"
              subtitle="Sizes and colours this product comes in"
            />

            <div className="space-y-6 p-5">
              {/* Sizes */}
              <div>
                <label className={labelClass}>Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={product.sizes.includes(size)}
                      onClick={() => toggleInList("sizes", size)}
                      className={`${chipClass(product.sizes.includes(size))} min-w-12`}
                    >
                      {size}
                    </button>
                  ))}
                  {product.sizes
                    .filter((s) => !SIZE_PRESETS.includes(s))
                    .map((size) => (
                      <span
                        key={size}
                        className="inline-flex items-center gap-1 rounded-lg border border-indigo-600 bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm"
                      >
                        {size}
                        <RemoveX label={`Remove size ${size}`} onClick={() => toggleInList("sizes", size)} />
                      </span>
                    ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={tagKeyDown("sizes", sizeInput, setSizeInput)}
                    placeholder="Custom size, e.g. 32, 34 or Free size"
                    className={inputClass("sizes")}
                  />
                  <button
                    type="button"
                    onClick={() => addTag("sizes", sizeInput, setSizeInput)}
                    className="shrink-0 rounded-lg border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className={labelClass}>Colours</label>
                <div
                  className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white px-2.5 py-2 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
                  onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
                >
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-1.5 pr-2 text-xs font-medium text-gray-700 ring-1 ring-gray-200"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                        style={{ background: isCssColor(color) ? color.toLowerCase() : "conic-gradient(#f87171,#facc15,#4ade80,#60a5fa,#c084fc,#f87171)" }}
                      />
                      {color}
                      <RemoveX label={`Remove colour ${color}`} onClick={() => toggleInList("colors", color)} />
                    </span>
                  ))}
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={tagKeyDown("colors", colorInput, setColorInput)}
                    onBlur={() => addTag("colors", colorInput, setColorInput)}
                    placeholder={product.colors.length ? "Add another..." : "Type a colour and press Enter, e.g. Black, Navy"}
                    className="min-w-40 flex-1 border-0 bg-transparent px-1 py-0.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Press Enter or comma to add · Backspace removes the last one</p>
              </div>
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
                    {product.isActive ? "Visible to shoppers on the store" : "Hidden from the store"}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={product.isActive}
                  aria-label="Product visibility"
                  onClick={() => setField("isActive", !product.isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-4 focus:ring-indigo-100 ${
                    product.isActive ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      product.isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <span
                className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.isActive
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${product.isActive ? "bg-green-500" : "bg-gray-400"}`} />
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </section>

          {/* Categories */}
          <section className={cardClass}>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Categories <span className="text-red-500">*</span>
              </h2>
              <p className="text-xs text-gray-500">
                {product.categories.length
                  ? `${product.categories.length} selected`
                  : "Where shoppers will find this product"}
              </p>
            </div>
            <div className="p-5">
              {categoriesLoading ? (
                <p className="text-sm text-gray-400">Loading categories...</p>
              ) : allCategories.length === 0 ? (
                <p className="text-sm text-gray-500">No categories yet. Create one first.</p>
              ) : (
                <ul className="max-h-64 space-y-1 overflow-y-auto">
                  {allCategories.map((c) => {
                    const checked = product.categories.includes(c._id);
                    return (
                      <li key={c._id}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${
                            checked ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleInList("categories", c._id)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="flex-1 truncate">{c.categoryName}</span>
                          {c.isActive === false && (
                            <span className="text-[10px] font-medium uppercase text-gray-400">Hidden</span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
              <FieldError message={errors.categories} />
            </div>
          </section>

          {/* Live preview */}
          <section className={`${cardClass} lg:sticky lg:top-6`}>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-gray-900">Live preview</h2>
              <p className="text-xs text-gray-500">How the card looks on your store</p>
            </div>
            <div className="p-5">
              <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                <div className="relative aspect-[4/5] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
                  {coverImage ? (
                    <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="h-12 w-12 text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  )}
                  {discountNum > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      -{discountNum}%
                    </span>
                  )}
                  {!product.isActive ? (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
                      Hidden
                    </span>
                  ) : product.stock !== "" && stockNum === 0 ? (
                    <span className="absolute right-3 top-3 rounded-full bg-gray-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Sold out
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1.5 p-4">
                  {(product.brand.trim() || selectedCategoryNames.length > 0) && (
                    <p className="truncate text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      {[product.brand.trim(), selectedCategoryNames[0]].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {product.name.trim() || "Product name"}
                  </h3>
                  <p className="line-clamp-2 text-xs text-gray-500">
                    {product.summary.trim() || "Your product summary will appear here."}
                  </p>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(finalPrice)}</span>
                    {discountNum > 0 && (
                      <span className="text-xs text-gray-400 line-through">{formatCurrency(priceNum)}</span>
                    )}
                  </div>
                  {(product.colors.length > 0 || product.sizes.length > 0) && (
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex -space-x-1">
                        {product.colors.filter(isCssColor).slice(0, 5).map((color) => (
                          <span
                            key={color}
                            title={color}
                            className="h-4 w-4 rounded-full ring-2 ring-white"
                            style={{ background: color.toLowerCase() }}
                          />
                        ))}
                      </div>
                      <span className="truncate text-[11px] text-gray-500">{product.sizes.join(" · ")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky footer actions (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-end gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
        <ActionButtons onCancel={onCancel} submitting={submitting} label={submitLabel} />
      </div>
    </form>
  );
};

export default ProductForm;
