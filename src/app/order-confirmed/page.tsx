import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { OrderConfirmed } from "@/components/checkout/OrderConfirmed";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your RK Memory Studio order is confirmed.",
  alternates: { canonical: "/order-confirmed" },
  // A personal confirmation, tied to one order. Never indexed.
  robots: { index: false, follow: false },
};

/** Stripe sends the customer back here with ?reference=RK-XXXXXX. */
export default function OrderConfirmedPage() {
  return (
    <>
      <PageHeader
        eyebrow="Thank You"
        title="Your Order Is Confirmed"
        lede="Your photographs are with the studio, and your keepsakes are on the way to being made."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Order Confirmed", href: "/order-confirmed" },
        ]}
      />

      <Section tone="ivory" spacing="lg">
        <Suspense
          fallback={<div className="u-skeleton mx-auto h-72 w-full max-w-[34rem]" />}
        >
          <OrderConfirmed />
        </Suspense>
      </Section>
    </>
  );
}
