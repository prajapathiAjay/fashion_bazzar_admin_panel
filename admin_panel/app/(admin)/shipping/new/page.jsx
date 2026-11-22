"use client";

import { useRouter } from "next/navigation";
import ShippingMethodForm from "@/components/shipping/ShippingMethodForm";
import { useCreateShippingMethodMutation } from "@/lib/api/shippingApi";

export default function NewShippingMethodPage() {
  const router = useRouter();
  const [createMethod] = useCreateShippingMethodMutation();

  // errors thrown here are shown at the top of the form
  const handleSubmit = async (method) => {
    await createMethod(method).unwrap();
    router.push("/shipping");
  };

  return (
    <div className="p-6">
      <ShippingMethodForm onSubmit={handleSubmit} onCancel={() => router.push("/shipping")} />
    </div>
  );
}
