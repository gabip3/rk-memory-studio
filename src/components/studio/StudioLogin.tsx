import { Container } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

/**
 * The gate on the studio's order screen.
 *
 * When no password is configured the screen stays shut rather than open: what
 * is behind it is customers' photographs and home addresses, so the failure
 * mode has to be "nobody gets in", not "everybody does".
 */
export function StudioLogin({
  failed,
  unconfigured,
}: {
  failed: boolean;
  unconfigured: boolean;
}) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-[24rem] border border-taupe/50 bg-cream p-8">
        <h1 className="text-display-s">Studio</h1>
        <p className="mt-3 text-[0.9375rem] leading-[1.75] text-ink-muted">
          Orders and customer photographs.
        </p>

        {unconfigured ? (
          <p
            role="alert"
            className="mt-6 border-l-2 border-gold bg-gold-wash px-4 py-3 text-[0.875rem] leading-relaxed text-ink"
          >
            This screen has no password set, so it cannot be opened. Set
            STUDIO_PASSWORD in the hosting environment.
          </p>
        ) : (
          <form action="/api/studio/login" method="post" className="mt-7">
            <label
              htmlFor="studio-password"
              className="u-caps text-[0.625rem] tracking-[0.2em] text-ink-subtle"
            >
              Password
            </label>
            <input
              id="studio-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="mt-2 h-12 w-full border border-taupe bg-ivory px-4 text-[1rem] text-ink outline-none focus:border-gold-ink"
            />

            {failed ? (
              <p
                role="alert"
                className="mt-3 flex items-center gap-2 text-[0.875rem] text-ink"
              >
                <Icon name="alert" size={15} className="shrink-0 text-gold-ink" />
                That password is not right.
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-6 h-12 w-full bg-black text-[0.8125rem] uppercase tracking-[0.16em] text-ivory transition-colors duration-[var(--dur-base)] hover:bg-charcoal"
            >
              Sign In
            </button>
          </form>
        )}
      </div>
    </Container>
  );
}
