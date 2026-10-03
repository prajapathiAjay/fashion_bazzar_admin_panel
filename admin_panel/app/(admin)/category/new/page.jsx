"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/components/category/CategoryForm";
import { useCreateCategoryMutation } from "@/lib/api/categoriesApi";
import { useUploadFilesMutation } from "@/lib/api/uploadApi";

export default function NewCategoryPage() {
  const router = useRouter();
  const [uploadFiles] = useUploadFilesMutation();
  const [createCategory] = useCreateCategoryMutation();

  const handleSubmit = async ({ imageFile, ...category }) => {
    let image = category.image;

    // 1. Upload the image first (if one was picked) to get its Cloudinary URL
    if (imageFile) {
      const [uploaded] = await uploadFiles({ files: imageFile, folder: "categories" }).unwrap();
      image = uploaded.url;
    }

    // 2. Save the category with the image URL
    await createCategory({ ...category, image }).unwrap();
    router.push("/category");
  };

  return (
    <div className="p-6">
      <CategoryForm onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}
