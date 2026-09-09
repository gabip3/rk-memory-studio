import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { getPublicCheckoutStatus } from "@/lib/checkout/config";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your RK Memory Studio order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

/** Config is read per-request so switching env vars needs no rebuild. */
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const { ready, provider, shopUrl } = getPublicCheckoutStatus();

  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Almost There"
        lede="Confirm your order and we will hand you over to complete payment."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Cart", href: "/cart" },
          { name: "Checkout", href: "/checkout" },
        ]}
      />

      <Section tone="ivory" spacing="lg">
        <CheckoutClient checkoutReady={ready} provider={provider} shopUrl={shopUrl} />
      </Section>
    </>
  );
}
