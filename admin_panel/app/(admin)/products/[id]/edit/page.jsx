"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/products/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleSubmit = async (updated) => {
    const res = await fetch(`/api/products/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (!res.ok) {
      throw new Error("Failed to update product");
    }

    router.push("/products");
  };

  if (loadError) {
    return <p className="p-6 text-red-500">{loadError}</p>;
  }

  if (!product) {
    return <p className="p-6 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6">
      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
