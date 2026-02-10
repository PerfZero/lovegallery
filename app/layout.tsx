import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/data/site-config";
import { TransitionProvider } from "@/context/TransitionContext";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { Analytics } from "@/components/ui/Analytics";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

// =============================================================================
// Metadata Configuration
// =============================================================================

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.fullName,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    title: siteConfig.fullName,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.fullName,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: siteConfig.fullName,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.fullName,
    description: siteConfig.description,
    images: [DEFAULT_OG_IMAGE],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1917" },
  ],
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="antialiased">
        <TransitionProvider>
          {children}
          <ScrollToTop />
          <CookieConsent />
        </TransitionProvider>

        {/* Analytics - replace with your actual IDs */}
        <Analytics yandexMetrikaId="" googleAnalyticsId="" />
      </body>
    </html>
  );
}
