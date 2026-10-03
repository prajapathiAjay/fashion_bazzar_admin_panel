"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDeleteCategoryMutation, useGetCategoryQuery } from "@/lib/api/categoriesApi";

const formatDate = (value) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function ViewCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: category, isLoading, error } = useGetCategoryQuery(id);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${category.categoryName}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(id).unwrap();
      router.push("/category");
    } catch (err) {
      alert(err?.data?.message || "Failed to delete category");
    }
  };

  if (isLoading) return <p className="p-6 text-gray-500">Loading category...</p>;
  if (error || !category) return <p className="p-6 text-red-500">Category not found</p>;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
            <Link href="/category" className="hover:text-indigo-600">
              Categories
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-700">{category.categoryName}</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {category.categoryName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <Link
            href={`/category/${id}/edit`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* Image */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:col-span-2">
          {category.image ? (
            <img
              src={category.image}
              alt={category.categoryName}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-50 text-sm text-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm md:col-span-3">
          <div className="px-5 py-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
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
            </dd>
          </div>
          <div className="px-5 py-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</dt>
            <dd className="mt-1 whitespace-pre-line text-sm text-gray-800">
              {category.description || <span className="text-gray-400">No description</span>}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-4 px-5 py-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-800">{formatDate(category.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Updated</dt>
              <dd className="mt-1 text-sm text-gray-800">{formatDate(category.updatedAt)}</dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
