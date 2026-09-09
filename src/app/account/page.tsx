import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { site, isPlaceholder } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your Account",
  description:
    "Find an order, check its status, or get in touch with RK Memory Studio.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: true },
};

/**
 * Account.
 *
 * There is deliberately no login here. Orders and customer records live in
 * the checkout provider, which owns the order workflow. Building a parallel
 * account system here would duplicate that and split the source of truth.
 *
 * NEXT_PUBLIC_ORDER_PORTAL_URL points the primary button at the provider's
 * customer portal once the business supplies one.
 */
export default function AccountPage() {
  const portalUrl = process.env.NEXT_PUBLIC_ORDER_PORTAL_URL;
  const hasPortal = !isPlaceholder(portalUrl);
  const hasEmail = !isPlaceholder(site.contact.email);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Your Orders"
        lede="Your order details live with our ordering system. Here is how to reach them."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Account", href: "/account" },
        ]}
      />

      <Section tone="ivory" spacing="lg" width="narrow">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal className="flex flex-col border border-taupe/50 bg-cream p-7">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-full border border-gold/45 text-gold"
            >
              <Icon name="truck" size={21} strokeWidth={1.2} />
            </span>

            <h2 className="mt-5 text-[1.375rem]">Check an order</h2>

            <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.75] text-ink-muted">
              Have your order reference to hand. It looks like{" "}
              <span className="tabular">RK-XXXXXX</span> and was shown to you at
              checkout.
            </p>

            {hasPortal ? (
              <Button href={portalUrl!} variant="solid" className="mt-6">
                Open Order Portal
              </Button>
            ) : (
              <Button href="/help/order-status" variant="outline" className="mt-6">
                Order Status
              </Button>
            )}
          </Reveal>

          <Reveal delay={70} className="flex flex-col border border-taupe/50 bg-cream p-7">
            <span
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-full border border-gold/45 text-gold"
            >
              <Icon name="mail" size={21} strokeWidth={1.2} />
            </span>

            <h2 className="mt-5 text-[1.375rem]">Ask us directly</h2>

            <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.75] text-ink-muted">
              Lost your reference, or need to change something on an order? Tell
              us the email address you ordered with and we will find it.
            </p>

            <Button
              href={hasEmail ? `mailto:${site.contact.email}` : "/contact"}
              variant="outline"
              className="mt-6"
            >
              Contact Us
            </Button>
          </Reveal>
        </div>

        <Reveal delay={130} className="mt-10 flex items-start gap-3 border-l-2 border-gold bg-gold-wash/50 px-5 py-4">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-gold-ink" />
          <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
            You do not need an account to order. Choose a keepsake, upload your
            photos and check out, and we will email your order reference.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
