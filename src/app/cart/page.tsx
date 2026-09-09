import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { CartContents } from "@/components/cart/CartContents";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the keepsakes and photos in your RK Memory Studio order.",
  alternates: { canonical: "/cart" },
  // A personal cart should never be indexed.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your Order"
        title="Your Cart"
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
        ]}
      />

      <Section tone="ivory" spacing="lg">
        <CartContents />
      </Section>
    </>
  );
}
