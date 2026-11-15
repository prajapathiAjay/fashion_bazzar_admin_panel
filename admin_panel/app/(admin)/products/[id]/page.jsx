"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useDeleteProductMutation, useGetProductQuery } from "@/lib/api/productsApi";
import { useGetCategoriesQuery } from "@/lib/api/categoriesApi";
import { formatCurrency } from "@/components/dashboard/format";

// Where the customer website runs, for the "View in store" button
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:5173";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

// One labelled row in the details card
function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  );
}

const Empty = ({ children }) => <span className="text-subtle">{children}</span>;

export default function ViewProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [activeImage, setActiveImage] = useState(0);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"? This also removes it from bags and wishlists, and cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
      router.push("/products");
    } catch (err) {
      alert(err?.data?.message || "Failed to delete product");
    }
  };

  if (isLoading) return <p className="p-6 text-muted">Loading product...</p>;
  if (error || !product) return <p className="p-6 text-danger">Product not found</p>;

  const images = product.images ?? [];
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  // older products have no sellingPrice saved, so work it out
  const sellingPrice = product.sellingPrice ?? Math.round(price * (1 - discount / 100));
  const stock = product.stock ?? 0;
  // the product stores category ids; look their names up
  const categoryNames = (product.categories ?? [])
    .map((categoryId) => categories.find((c) => c._id === categoryId)?.categoryName)
    .filter(Boolean);
  const rating = typeof product.rating === "object" ? product.rating : null;

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            <Link href="/products" className="hover:text-brand">
              Products
            </Link>
            <span>/</span>
            <span className="truncate font-medium text-ink-soft">{product.name}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{product.name}</h1>
          {product.brand && <p className="mt-1 text-sm text-muted">by {product.brand}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`${STORE_URL}/products/${id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-mist"
          >
            <ExternalLink size={15} /> View in store
          </a>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger/30 bg-white px-4 py-2 text-sm font-medium text-danger shadow-sm transition hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={15} /> {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <Link
            href={`/products/${id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark"
          >
            <Pencil size={15} /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Images */}
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[Math.min(activeImage, images.length - 1)]}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-snow text-sm text-subtle">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((src, i) => (
                <button
                  type="button"
                  key={src + i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={`h-16 w-14 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <dl className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm md:col-span-3">
          <div className="grid grid-cols-2 gap-4 px-5 py-4">
            <Field label="Status">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  product.isActive
                    ? "bg-success-50 text-success ring-1 ring-success/30"
                    : "bg-mist text-muted ring-1 ring-line"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${product.isActive ? "bg-success" : "bg-line-hover"}`} />
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </Field>
            <Field label="Stock">
              <span className={stock === 0 ? "font-medium text-danger" : stock <= 5 ? "font-medium text-sun-dark" : ""}>
                {stock === 0 ? "Out of stock" : `${stock} in stock`}
                {stock > 0 && stock <= 5 && " · running low"}
              </span>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4 px-5 py-4">
            <Field label="Price">{formatCurrency(price)}</Field>
            <Field label="Discount">{discount ? `${discount}%` : <Empty>None</Empty>}</Field>
            <Field label="Selling price">
              <span className="font-semibold text-brand">{formatCurrency(sellingPrice)}</span>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5 py-4">
            <Field label="Categories">
              {categoryNames.length ? categoryNames.join(", ") : <Empty>None</Empty>}
            </Field>
            <Field label="Rating">
              {rating?.count ? (
                `${rating.average} out of 5 · ${rating.count} ${rating.count === 1 ? "review" : "reviews"}`
              ) : (
                <Empty>No reviews yet</Empty>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5 py-4">
            <Field label="Sizes">
              {product.sizes?.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <span key={size} className="rounded-md border border-line-strong px-2 py-0.5 text-xs font-medium text-ink-soft">
                      {size}
                    </span>
                  ))}
                </span>
              ) : (
                <Empty>One size</Empty>
              )}
            </Field>
            <Field label="Colours">
              {product.colors?.length ? (
                <span className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {product.colors.map((color) => (
                    <span key={color} className="inline-flex items-center gap-1.5 capitalize">
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-line-hover"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      {color}
                    </span>
                  ))}
                </span>
              ) : (
                <Empty>None</Empty>
              )}
            </Field>
          </div>

          <div className="px-5 py-4">
            <Field label="Summary">{product.summary || <Empty>No summary</Empty>}</Field>
          </div>
          <div className="px-5 py-4">
            <Field label="Description">
              <span className="whitespace-pre-line">{product.description || <Empty>No description</Empty>}</span>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 px-5 py-4">
            <Field label="Created">{formatDate(product.createdAt)}</Field>
            <Field label="Updated">{formatDate(product.updatedAt)}</Field>
          </div>
        </dl>
      </div>
    </div>
  );
}
