"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/components/category/CategoryForm";
import { useCreateCategoryMutation } from "@/lib/api/categoriesApi";

export default function NewCategoryPage() {
  const router = useRouter();
  const [createCategory] = useCreateCategoryMutation();

  const handleSubmit = async ({ imageFile, ...category }) => {
    let body = category;

    // Send multipart only when an image is attached; the backend reads it as the "image" field
    if (imageFile) {
      body = new FormData();
      body.append("categoryName", category.categoryName);
      body.append("description", category.description);
      body.append("isActive", String(category.isActive));
      body.append("image", imageFile);
    }

    await createCategory(body).unwrap();
    router.push("/category");
  };

  return (
    <div className="p-6">
      <CategoryForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
