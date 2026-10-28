import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { getStorageAdapter } from "@/lib/uploads/adapter";
import { isSignedIn, studioPasswordIsSet } from "@/lib/studio/auth";
import { formatPrice } from "@/lib/format";
import type { OrderManifest } from "@/lib/checkout/manifest";
import { StudioLogin } from "@/components/studio/StudioLogin";

export const metadata: Metadata = {
  title: "Studio Orders",
  robots: { index: false, follow: false },
};

/** Orders arrive while the page is open, so nothing here may be cached. */
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!(await isSignedIn())) {
    return (
      <StudioLogin
        failed={error === "1"}
        unconfigured={!studioPasswordIsSet()}
      />
    );
  }

  const adapter = getStorageAdapter();
  const stored = await adapter.listOrders(50);

  const orders = await Promise.all(
    stored.map(async (entry) => {
      const raw = await adapter.readOrder(entry.reference);
      let manifest: OrderManifest | null = null;
      try {
        manifest = raw ? (JSON.parse(raw) as OrderManifest) : null;
      } catch {
        manifest = null;
      }
      return { ...entry, manifest };
    })
  );

  return (
    <Container width="wide" className="py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-display-m">Orders</h1>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            Newest first. Open one to see its photographs.
          </p>
        </div>
        <form action="/api/studio/login" method="post">
          <input type="hidden" name="signout" value="1" />
          <button
            type="submit"
            className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle underline underline-offset-4 hover:text-ink"
          >
            Sign out
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <p className="mt-12 border border-dashed border-taupe/60 bg-cream px-6 py-12 text-center text-[0.9375rem] text-ink-muted">
          No orders yet. They appear here the moment a customer pays.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-taupe/60">
                {["Reference", "Placed", "Customer", "Items", "Photos", "Total"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="u-caps py-3 pr-4 text-[0.625rem] tracking-[0.2em] text-ink-subtle"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.reference} className="border-b border-taupe/40">
                  <td className="py-4 pr-4">
                    <Link
                      href={`/studio/${order.reference}`}
                      className="tabular font-medium text-ink underline-offset-4 hover:underline"
                    >
                      {order.reference}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {order.storedAt ? dateFormat.format(order.storedAt) : "-"}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {order.manifest?.customer?.email ?? "-"}
                  </td>
                  <td className="py-4 pr-4 text-ink-muted">
                    {order.manifest?.lines
                      .map((line) => line.quantityLabel)
                      .join(", ") ?? "-"}
                  </td>
                  <td className="tabular py-4 pr-4 text-ink-muted">
                    {order.manifest?.totalPhotos ?? "-"}
                  </td>
                  <td className="tabular py-4 pr-4 text-ink">
                    {order.manifest ? formatPrice(order.manifest.total) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-10 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-subtle">
        <Icon name="info" size={15} className="mt-0.5 shrink-0" />
        <span>
          Payment, refunds and receipts live in Stripe. This screen is for the
          photographs and what to print.
        </span>
      </p>
    </Container>
  );
}
