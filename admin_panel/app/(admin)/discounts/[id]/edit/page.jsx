"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DiscountForm from "@/components/discounts/DiscountForm";
import { useGetDiscountQuery, useUpdateDiscountMutation } from "@/lib/api/discountsApi";

export default function EditDiscountPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: discount, isLoading, error } = useGetDiscountQuery(id);
  const [updateDiscount] = useUpdateDiscountMutation();

  // errors thrown here are shown at the top of the form
  const handleSubmit = async (changes) => {
    await updateDiscount({ id, ...changes }).unwrap();
    router.push("/discounts");
  };

  if (isLoading) return <p className="p-6 text-muted">Loading discount...</p>;
  if (error || !discount) {
    return (
      <div className="p-6">
        <p className="text-danger">Discount not found</p>
        <Link href="/discounts" className="mt-3 inline-block text-sm text-brand hover:underline">
          Back to discounts
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* key: start the form fresh if a different discount loads */}
      <DiscountForm key={discount._id} initialValues={discount} onSubmit={handleSubmit} onCancel={() => router.push("/discounts")} />
    </div>
  );
}
