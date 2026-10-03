"use client";

import Link from "next/link";
import Table from "@/components/admin/Table";
import { useDeleteCategoryMutation, useGetCategoriesQuery } from "@/lib/api/categoriesApi";

const columns = [
  { col_label: "Category Name", value: "categoryName" },
  { col_label: "Description", value: "description" },
  { col_label: "Status", value: "status" },
  { col_label: "Actions", value: "actions" },
];

export default function Category() {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting, originalArgs: deletingId }] =
    useDeleteCategoryMutation();

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.categoryName}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(category._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete category");
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading categories...</p>;
  if (error) return <p className="text-red-500">Failed to load categories</p>;

  const rows = categories.map((c) => ({
    ...c,
    id: c._id,
    status: c.isActive ? "Active" : "Inactive",
    actions: (
      <div className="flex items-center gap-4">
        <Link
          href={`/category/${c._id}`}
          className="font-medium text-gray-600 hover:text-gray-900"
        >
          View
        </Link>
        <Link
          href={`/category/${c._id}/edit`}
          className="font-medium text-indigo-600 hover:text-indigo-800"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => handleDelete(c)}
          disabled={isDeleting && deletingId === c._id}
          className="font-medium text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting && deletingId === c._id ? "Deleting..." : "Delete"}
        </button>
      </div>
    ),
  }));

  return (
    <Table
      columns={columns}
      data={rows}
      tableHeading="Categories"
      addButton={{ name: "Add Category", path: "/category/new" }}
    />
  );
}
