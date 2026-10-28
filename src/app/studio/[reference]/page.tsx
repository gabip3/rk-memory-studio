import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { getStorageAdapter } from "@/lib/uploads/adapter";
import { isSignedIn, studioPasswordIsSet } from "@/lib/studio/auth";
import { formatPrice } from "@/lib/format";
import type { OrderManifest } from "@/lib/checkout/manifest";
import { StudioLogin } from "@/components/studio/StudioLogin";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function photoUrl(key: string, name: string, download = false): string {
  const params = new URLSearchParams({ key, name });
  if (download) params.set("download", "1");
  return `/api/studio/photo?${params.toString()}`;
}

export default async function StudioOrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  if (!(await isSignedIn())) {
    return <StudioLogin failed={false} unconfigured={!studioPasswordIsSet()} />;
  }

  const raw = await getStorageAdapter().readOrder(reference);
  if (!raw) notFound();

  let order: OrderManifest;
  try {
    order = JSON.parse(raw) as OrderManifest;
  } catch {
    notFound();
  }

  return (
    <Container width="wide" className="py-14">
      <Link
        href="/studio"
        className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle underline underline-offset-4 hover:text-ink"
      >
        All orders
      </Link>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h1 className="tabular text-display-m">{order.reference}</h1>
        <p className="tabular text-[1.125rem] text-ink">
          {formatPrice(order.total)}
        </p>
      </div>

      <dl className="mt-6 grid gap-x-10 gap-y-3 border-y border-taupe/50 py-5 text-[0.9375rem] sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-ink-subtle">Placed:</dt>
          <dd className="text-ink">
            {dateFormat.format(new Date(order.createdAt))}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-subtle">Customer:</dt>
          <dd className="break-words text-ink">
            {order.customer?.email ?? "not given"}
          </dd>
        </div>
      </dl>

      <p className="mt-5 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-subtle">
        <Icon name="info" size={15} className="mt-0.5 shrink-0" />
        <span>
          The delivery address is on the payment in Stripe, collected there at
          checkout.
        </span>
      </p>

      {order.lines.map((line) => (
        <section key={line.lineId} className="mt-12">
          <h2 className="text-display-s">
            {line.quantityLabel}
            {line.variantName ? `, ${line.variantName}` : null}
          </h2>
          <p className="mt-1 text-[0.9375rem] text-ink-muted">
            {line.productName} &middot; {formatPrice(line.linePrice)}
          </p>

          {line.personalization.name ||
          line.personalization.date ||
          line.personalization.message ? (
            <dl className="mt-5 border border-gold/45 bg-gold-wash p-5 text-[0.9375rem]">
              <p className="u-caps mb-3 text-[0.625rem] tracking-[0.2em] text-ink-subtle">
                Print exactly as written
              </p>
              {line.personalization.name ? (
                <div className="flex gap-2">
                  <dt className="text-ink-subtle">Name:</dt>
                  <dd className="text-ink">{line.personalization.name}</dd>
                </div>
              ) : null}
              {line.personalization.date ? (
                <div className="flex gap-2">
                  <dt className="text-ink-subtle">Date:</dt>
                  <dd className="text-ink">{line.personalization.date}</dd>
                </div>
              ) : null}
              {line.personalization.message ? (
                <div className="flex gap-2">
                  <dt className="text-ink-subtle">Message:</dt>
                  <dd className="text-ink">{line.personalization.message}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {line.notes ? (
            <p className="mt-4 text-[0.9375rem] leading-[1.75] text-ink-muted">
              <span className="text-ink">Customer notes:</span> {line.notes}
            </p>
          ) : null}

          <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {line.photos.map((photo, index) => (
              <li key={photo.storageKey || index} className="border border-taupe/50 bg-cream">
                {photo.storageKey ? (
                  <a
                    href={photoUrl(photo.storageKey, photo.fileName)}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    {/* Deliberately a plain img: these are private, one-off
                        originals, so there is nothing for an image optimiser
                        to cache or reuse. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl(photo.storageKey, photo.fileName)}
                      alt={`Photograph ${index + 1} for ${order.reference}: ${photo.fileName}`}
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                ) : (
                  <p className="aspect-square grid place-items-center p-4 text-center text-[0.8125rem] text-ink-muted">
                    This photo never finished uploading.
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-taupe/50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[0.8125rem] text-ink">
                      {photo.fileName}
                    </p>
                    <p className="tabular text-[0.75rem] text-ink-subtle">
                      {photo.width && photo.height
                        ? `${photo.width} x ${photo.height}`
                        : "size unknown"}
                      {photo.size
                        ? ` · ${(photo.size / 1024 / 1024).toFixed(1)} MB`
                        : null}
                    </p>
                  </div>
                  {photo.storageKey ? (
                    <a
                      href={photoUrl(photo.storageKey, photo.fileName, true)}
                      className="u-caps shrink-0 text-[0.625rem] tracking-[0.2em] text-gold-ink underline underline-offset-4"
                    >
                      Download
                    </a>
                  ) : null}
                </div>

                {photo.warning ? (
                  <p className="border-t border-taupe/50 px-4 py-3 text-[0.8125rem] leading-relaxed text-ink-muted">
                    {photo.warning}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
