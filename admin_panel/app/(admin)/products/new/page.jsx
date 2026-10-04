"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";
import { useCreateProductMutation } from "@/lib/api/productsApi";
import { useUploadFilesMutation } from "@/lib/api/uploadApi";
import { resolveImageUrls } from "@/lib/uploadImages";

export default function NewProductPage() {
  const router = useRouter();
  const [uploadFiles] = useUploadFilesMutation();
  const [createProduct] = useCreateProductMutation();

  const handleSubmit = async (product) => {
    // 1. Upload newly picked images to Cloudinary, keeping their order
    const images = await resolveImageUrls(product.images, uploadFiles, "products");

    // 2. Save the product with the image URLs
    await createProduct({ ...product, images }).unwrap();
    router.push("/products");
  };

  return (
    <div className="p-6">
      <ProductForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
