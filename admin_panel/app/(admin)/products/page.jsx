"use client";

import Table from "@/components/admin/Table";
import { useGetProductsQuery } from "@/lib/api/productsApi";

const columns = [
  { col_label: "Product Name", value: "name" },
  { col_label: "Brand", value: "brand" },
  { col_label: "Price", value: "price" },
  { col_label: "Discount %", value: "discount" },
  { col_label: "Stock", value: "stock" },
  { col_label: "Status", value: "status" },
  { col_label: "Created Date", value: "createdDate" },
];

export default function Products() {
  const { data: products = [], isLoading, error } = useGetProductsQuery();

  if (isLoading) return <p className="text-gray-500">Loading products...</p>;
  if (error) return <p className="text-red-500">Failed to load products</p>;

  const rows = products.map((p) => ({
    ...p,
    status: p.isActive ? "Active" : "Inactive",
    createdDate: new Date(p.createdAt).toLocaleDateString(),
  }));

  return (
    <Table
      columns={columns}
      data={rows}
      tableHeading="Products"
      addButton={{ name: "Add Product", path: "/products/new" }}
    />
  );
}
