import type { Metadata } from "next";
import { Container } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark height={64} className="opacity-40" />

      <h1 className="mt-8 text-display-m">
        This page has gone missing
      </h1>
      <p className="u-measure mt-6 text-[1.0625rem] leading-[1.8] text-ink-muted">
        The page you were looking for is not here. Your memories, thankfully, are
        somewhere safer.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="solid" size="lg">
          Back to Home
        </Button>
        <Button href="/shop" variant="outline" size="lg">
          Browse Keepsakes
        </Button>
      </div>
    </Container>
  );
}
