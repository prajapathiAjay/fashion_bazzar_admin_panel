"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm"

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (product) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      throw new Error("Failed to create product");
    }

    router.push("/products");
  };

  return (
    <div className="p-6">
      <ProductForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
