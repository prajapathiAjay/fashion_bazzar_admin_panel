"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ShippingMethodForm from "@/components/shipping/ShippingMethodForm";
import { useGetShippingMethodQuery, useUpdateShippingMethodMutation } from "@/lib/api/shippingApi";

export default function EditShippingMethodPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: method, isLoading, error } = useGetShippingMethodQuery(id);
  const [updateMethod] = useUpdateShippingMethodMutation();

  // errors thrown here are shown at the top of the form
  const handleSubmit = async (changes) => {
    await updateMethod({ id, ...changes }).unwrap();
    router.push("/shipping");
  };

  if (isLoading) return <p className="p-6 text-muted">Loading shipping method...</p>;
  if (error || !method) {
    return (
      <div className="p-6">
        <p className="text-danger">Shipping method not found</p>
        <Link href="/shipping" className="mt-3 inline-block text-sm text-brand hover:underline">
          Back to shipping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ShippingMethodForm key={method._id} initialValues={method} onSubmit={handleSubmit} onCancel={() => router.push("/shipping")} />
    </div>
  );
}
