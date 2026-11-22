"use client";

import { useRouter } from "next/navigation";
import DiscountForm from "@/components/discounts/DiscountForm";
import { useCreateDiscountMutation } from "@/lib/api/discountsApi";

export default function NewDiscountPage() {
  const router = useRouter();
  const [createDiscount] = useCreateDiscountMutation();

  // errors thrown here are shown at the top of the form (e.g. "code already exists")
  const handleSubmit = async (discount) => {
    await createDiscount(discount).unwrap();
    router.push("/discounts");
  };

  return (
    <div className="p-6">
      <DiscountForm onSubmit={handleSubmit} onCancel={() => router.push("/discounts")} />
    </div>
  );
}
