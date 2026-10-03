"use client";

import Link from "next/link";
import Table from "@/components/admin/Table";
import { useGetCategoriesQuery } from "@/lib/api/categoriesApi";

const columns = [
  { col_label: "Category Name", value: "categoryName" },
  { col_label: "Description", value: "description" },
  { col_label: "Status", value: "status" },
  { col_label: "Actions", value: "actions" },
];

export default function Category() {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <p className="text-gray-500">Loading categories...</p>;
  if (error) return <p className="text-red-500">Failed to load categories</p>;

  const rows = categories.map((c) => ({
    ...c,
    id: c._id,
    status: c.isActive ? "Active" : "Inactive",
    actions: (
      <Link
        href={`/category/${c._id}/edit`}
        className="font-medium text-indigo-600 hover:text-indigo-800"
      >
        Edit
      </Link>
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
