"use client";

import { useParams, useRouter } from "next/navigation";
import CategoryForm from "@/components/category/CategoryForm";
import { useGetCategoryQuery, useUpdateCategoryMutation } from "@/lib/api/categoriesApi";
import { useUploadFilesMutation } from "@/lib/api/uploadApi";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: category, isLoading, error } = useGetCategoryQuery(id);
  const [uploadFiles] = useUploadFilesMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleSubmit = async ({ imageFile, ...updated }) => {
    // Keeps the existing URL, or null if the user removed the image
    let image = updated.image;

    // 1. Upload only if a new image was picked
    if (imageFile) {
      const [uploaded] = await uploadFiles({ files: imageFile, folder: "categories" }).unwrap();
      image = uploaded.url;
    }

    // 2. Save the changes
    await updateCategory({ id, ...updated, image }).unwrap();
    router.push("/category");
  };

  if (isLoading) return <p className="p-6 text-gray-500">Loading category...</p>;
  if (error || !category) return <p className="p-6 text-red-500">Category not found</p>;

  return (
    <div className="p-6">
      <CategoryForm
        initialValues={category}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  );
}
