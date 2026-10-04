"use client";

import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { useGetProductQuery, useUpdateProductMutation } from "@/lib/api/productsApi";
import { useUploadFilesMutation } from "@/lib/api/uploadApi";
import { resolveImageUrls } from "@/lib/uploadImages";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductQuery(id);
  const [uploadFiles] = useUploadFilesMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleSubmit = async (updated) => {
    // 1. Upload newly picked images to Cloudinary, keeping their order
    const images = await resolveImageUrls(updated.images, uploadFiles, "products");

    // 2. Save the changes
    await updateProduct({ id, ...updated, images }).unwrap();
    router.push("/products");
  };

  if (isLoading) return <p className="p-6 text-gray-500">Loading product...</p>;
  if (error || !product) return <p className="p-6 text-red-500">Product not found</p>;

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
