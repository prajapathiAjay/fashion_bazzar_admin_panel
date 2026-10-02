"use client";

import React, { useState } from "react";

/**
 * ProductForm
 *
 * Shared form for both creating and editing a product.
 * Pass `initialValues` to switch it into edit mode (pre-fills fields,
 * changes heading/button copy). Omit it for create/add mode.
 *
 * @param {object} [initialValues] - existing product to edit; omit for "add" mode
 * @param {(product: object) => void} [onSubmit] - receives the validated product object
 * @param {() => void} [onCancel]
 * @param {Array<string>} [categories] - options for the category select
 */
const emptyProduct = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  imagePreview: null,
  status: "active",
};

const ProductForm = ({
  initialValues,
  onSubmit,
  onCancel,
  categories = ["Apparel", "Electronics", "Home & Kitchen", "Beauty", "Other"],
}) => {
  const isEditMode = Boolean(initialValues);

  const [product, setProduct] = useState({
    ...emptyProduct,
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setProduct((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProduct((prev) => ({ ...prev, imagePreview: reader.result, imageFile: file }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!product.name.trim()) next.name = "Product name is required";
    if (!product.sku.trim()) next.sku = "SKU is required";
    if (!product.category) next.category = "Choose a category";
    if (!product.price || Number(product.price) <= 0)
      next.price = "Enter a price greater than 0";
    if (product.stock === "" || Number(product.stock) < 0)
      next.stock = "Enter a valid stock quantity";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      });
      if (!isEditMode) setProduct(emptyProduct); // reset only after a fresh "add"
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-md border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  const sectionClass = "rounded-lg border border-gray-200 bg-white p-5";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto pb-24">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit product" : "Add product"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEditMode
              ? "Update the details below and save your changes."
              : "Fill in the details below to add a new product to your catalog."}
          </p>
        </div>

        {/* Actions also live here for wide screens; sticky bar below covers mobile/scroll */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? "Saving..."
              : isEditMode
              ? "Save changes"
              : "Save product"}
          </button>
        </div>
      </div>

      {/* Two-column layout: main fields left, media/organization right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-800 mb-4">
              Basic information
            </h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={handleChange("name")}
                  placeholder="e.g. Classic Cotton T-Shirt"
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={5}
                  value={product.description}
                  onChange={handleChange("description")}
                  placeholder="Briefly describe the product..."
                  className={inputClass("description")}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-800 mb-4">
              Pricing &amp; inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={handleChange("price")}
                    placeholder="0.00"
                    className={`${inputClass("price")} pl-6`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Stock quantity</label>
                <input
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={handleChange("stock")}
                  placeholder="0"
                  className={inputClass("stock")}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>SKU</label>
                <input
                  type="text"
                  value={product.sku}
                  onChange={handleChange("sku")}
                  placeholder="e.g. TSHIRT-001"
                  className={inputClass("sku")}
                  disabled={isEditMode}
                />
                {isEditMode ? (
                  <p className="text-xs text-gray-400 mt-1">Can't change after creation</p>
                ) : (
                  errors.sku && (
                    <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Image</h2>
            <div className="flex flex-col items-center gap-3">
              <div className="h-32 w-32 rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.imagePreview ? (
                  <img
                    src={product.imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400 text-center px-2">No image</span>
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-400">PNG or JPG, up to 5MB</p>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={product.category}
                  onChange={handleChange("category")}
                  className={inputClass("category")}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={product.status}
                  onChange={handleChange("status")}
                  className={inputClass("status")}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer actions (mirrors header actions; always reachable while scrolling) */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Saving..." : isEditMode ? "Save changes" : "Save product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
