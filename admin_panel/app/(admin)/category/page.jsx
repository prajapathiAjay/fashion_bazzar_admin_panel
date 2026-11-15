"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Table from "@/components/admin/Table";
import ActionsMenu from "@/components/admin/ActionsMenu";
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

  if (isLoading) return <p className="text-muted">Loading categories...</p>;
  if (error) return <p className="text-danger">Failed to load categories</p>;

  const rows = categories.map((c) => ({
    ...c,
    id: c._id,
    status: c.isActive ? "Active" : "Inactive",
    actions: (
      <ActionsMenu
        label={`Actions for ${c.categoryName}`}
        items={[
          { label: "View", icon: Eye, href: `/category/${c._id}` },
          { label: "Edit", icon: Pencil, href: `/category/${c._id}/edit` },
          {
            label: isDeleting && deletingId === c._id ? "Deleting..." : "Delete",
            icon: Trash2,
            danger: true,
            disabled: isDeleting && deletingId === c._id,
            onClick: () => handleDelete(c),
          },
        ]}
      />
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
