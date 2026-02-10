import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

export const DEFAULT_OG_IMAGE = "/images/love_interior_emotion.webp";

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
  return new URL(normalizedPath, siteConfig.url).toString();
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
  const ogImage = toAbsoluteUrl(options.image || DEFAULT_OG_IMAGE);

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [ogImage],
    },
    robots: getRobotsMeta(options.noIndex),
  };
}
