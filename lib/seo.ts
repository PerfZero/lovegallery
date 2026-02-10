import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

export const DEFAULT_OG_IMAGE = "/images/love_interior_emotion.webp";
export const SOCIAL_IMAGE_FALLBACK = "/images/interiors/interior_1.png";
export const resolvedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteConfig.url;

type OpenGraphType = "website" | "article";

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: OpenGraphType;
  keywords?: string[];
  noIndex?: boolean;
};

export function toAbsoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, resolvedSiteUrl).toString();
}

function getSocialImageUrls(image?: string) {
  const primary = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
  const urls = [primary];

  // Some social crawlers still fail on webp. Keep a png fallback second.
  if (/\.webp(\?|$)/i.test(primary)) {
    urls.push(toAbsoluteUrl(SOCIAL_IMAGE_FALLBACK));
  }

  return Array.from(new Set(urls));
}

function getRobotsMeta(noIndex?: boolean): Metadata["robots"] | undefined {
  if (!noIndex) {
    return undefined;
  }

  return {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  };
}

export function buildPageMetadata(options: BuildPageMetadataOptions): Metadata {
  const canonical = toAbsoluteUrl(options.path);
  const socialImages = getSocialImageUrls(options.image);

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonical,
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      type: options.type || "website",
      images: socialImages.map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: options.title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: socialImages,
    },
    robots: getRobotsMeta(options.noIndex),
  };
}
