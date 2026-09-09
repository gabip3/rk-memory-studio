import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Poppins } from "next/font/google";
import { site, SITE_URL } from "@/lib/site";
import { CartProvider } from "@/lib/cart/CartProvider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/**
 * Fonts are self-hosted and preloaded by next/font, so there is no request to
 * fonts.googleapis.com at runtime and no layout shift as they swap in.
 *
 * Both faces are shared with our sister brand RK 360 Photo Booth Rentals, at the
 * owner's request, so the two sites read as one family:
 *
 *   Bebas Neue - headings and the RK monogram
 *   Poppins    - navigation, buttons, body copy
 *
 * Bebas Neue is uppercase-only and ships a single weight, so headings never
 * need a bold variant. Its metrics differ sharply from a serif (very tall caps,
 * narrow set width), which is why globals.css gives headings their own
 * line-height and tracking rather than reusing generic values.
 *
 * Poppins is not variable, so the weights we actually use are listed explicitly
 * rather than shipping the whole family.
 */
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
  weight: "400",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} | ${site.positioning}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "custom photo magnets",
    "personalized photo keychains",
    "photo strip keepsakes",
    "wedding favours",
    "event keepsakes",
    "personalized gifts",
    "Atlanta",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} | ${site.positioning}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.positioning}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  category: "shopping",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Deliberately NOT setting maximumScale or userScalable - pinch zoom is an
  // accessibility requirement, not a layout inconvenience.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1a17" },
  ],
};

/**
 * Adds `.js` to <html> before first paint so the reveal styles only hide
 * content when JavaScript is actually available. Without this the page would
 * flash visible-then-hidden, and a JS failure would leave the page blank.
 */
const JS_FLAG = `document.documentElement.classList.add('js')`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script below adds `js` to <html>
    // before React hydrates, so the client element legitimately differs from
    // the server markup. This is scoped to <html> only.
    <html
      lang="en"
      className={`${bebasNeue.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="min-h-dvh bg-ivory antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-toast)] focus:bg-black focus:px-5 focus:py-3 focus:text-sm focus:uppercase focus:tracking-[0.16em] focus:text-ivory"
        >
          Skip to main content
        </a>

        <CartProvider>
          <ScrollReveal />
          <AnnouncementBar />
          <Header />

          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>

          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
