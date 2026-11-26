"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Table from "@/components/admin/Table";
import ActionsMenu from "@/components/admin/ActionsMenu";
import { useDeleteProductMutation, useGetProductsQuery } from "@/lib/api/productsApi";

const columns = [
  { col_label: "Product Name", value: "name" },
  { col_label: "Brand", value: "brand" },
  { col_label: "Price", value: "price" },
  { col_label: "Discount %", value: "discount" },
  { col_label: "Stock", value: "stock" },
  { col_label: "Status", value: "status" },
  { col_label: "Created Date", value: "createdDate" },
  { col_label: "Actions", value: "actions" },
];

export default function Products() {
  const { data: products = [], isLoading, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting, originalArgs: deletingId }] = useDeleteProductMutation();

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This also removes it from bags and wishlists and deletes its reviews. It cannot be undone. (To just hide it, set it to Inactive.)`)) return;
    try {
      await deleteProduct(product._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete product");
    }
  };

  if (isLoading) return <p className="text-muted">Loading products...</p>;
  if (error) return <p className="text-danger">Failed to load products</p>;

  const rows = products.map((p) => ({
    ...p,
    status: p.isActive ? "Active" : "Inactive",
    createdDate: new Date(p.createdAt).toLocaleDateString(),
    actions: (
      <ActionsMenu
        label={`Actions for ${p.name}`}
        items={[
          { label: "View", icon: Eye, href: `/products/${p._id}` },
          { label: "Edit", icon: Pencil, href: `/products/${p._id}/edit` },
          {
            label: isDeleting && deletingId === p._id ? "Deleting..." : "Delete",
            icon: Trash2,
            danger: true,
            disabled: isDeleting && deletingId === p._id,
            onClick: () => handleDelete(p),
          },
        ]}
      />
    ),
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
