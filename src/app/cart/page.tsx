import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { CartContents } from "@/components/cart/CartContents";
import { OrderByEnquiry } from "@/components/product/OrderByEnquiry";
import { featuredProduct } from "@/lib/data/products";
import { isEnquiryMode } from "@/lib/ordering";

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
        title={isEnquiryMode ? "Ordering" : "Your Cart"}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
        ]}
      />

      <Section tone="ivory" spacing="lg">
        {/* Nothing links here in enquiry mode, but a bookmark might. */}
        {isEnquiryMode ? (
          <div className="mx-auto max-w-[34rem]">
            <OrderByEnquiry product={featuredProduct()} />
          </div>
        ) : (
          <CartContents />
        )}
      </Section>
    </>
  );
}
