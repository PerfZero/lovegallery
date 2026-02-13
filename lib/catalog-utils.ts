import type { Artwork } from "@/data/artworks";
import type { CatalogItemDbRow } from "@/lib/db";

export const CATALOG_CATEGORIES = [
  "painting",
  "photo",
  "textile",
  "pet-furniture",
  "collections",
] as const;

export const CATALOG_ASPECT_RATIOS = [
  "portrait",
  "square",
  "landscape",
] as const;

export type CatalogCategory = (typeof CATALOG_CATEGORIES)[number];
export type CatalogAspectRatio = (typeof CATALOG_ASPECT_RATIOS)[number];

export type CatalogAdminItem = Artwork & {
  dbId: number;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ArtworkOptions = NonNullable<Artwork["options"]>;

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function sanitizeOptions(value: unknown): ArtworkOptions | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const sizes = Array.isArray(raw.sizes)
    ? raw.sizes.filter((x): x is string => typeof x === "string")
    : undefined;
  const finishes = Array.isArray(raw.finishes)
    ? raw.finishes.filter((x): x is string => typeof x === "string")
    : undefined;
  const fabrics = Array.isArray(raw.fabrics)
    ? raw.fabrics.filter((x): x is string => typeof x === "string")
    : undefined;

  if (!sizes && !finishes && !fabrics) return undefined;
  return { sizes, finishes, fabrics };
}

function isCatalogCategory(value: string): value is CatalogCategory {
  return (CATALOG_CATEGORIES as readonly string[]).includes(value);
}

function isAspectRatio(value: string): value is CatalogAspectRatio {
  return (CATALOG_ASPECT_RATIOS as readonly string[]).includes(value);
}

function ensureCategory(value: string): CatalogCategory {
  return isCatalogCategory(value) ? value : "painting";
}

function ensureAspectRatio(value: string): CatalogAspectRatio {
  return isAspectRatio(value) ? value : "square";
}

export function toArtwork(row: CatalogItemDbRow): Artwork {
  const images = parseJson<unknown>(row.images_json);
  const tags = parseJson<unknown>(row.tags_json);
  const options = parseJson<unknown>(row.options_json);

  return {
    id: row.slug,
    category: ensureCategory(row.category),
    title: row.title,
    artist: row.artist || undefined,
    price: row.price,
    image: row.image,
    videoSrc: row.video_src || undefined,
    model3dSrc: row.model_3d_src || undefined,
    images: Array.isArray(images)
      ? images.filter((x): x is string => typeof x === "string")
      : undefined,
    aspectRatio: ensureAspectRatio(row.aspect_ratio),
    tags: Array.isArray(tags)
      ? tags.filter((x): x is string => typeof x === "string")
      : [],
    description: row.description || undefined,
    isNew: Boolean(row.is_new),
    options: sanitizeOptions(options),
  };
}

export function toCatalogAdminItem(row: CatalogItemDbRow): CatalogAdminItem {
  const artwork = toArtwork(row);
  return {
    ...artwork,
    dbId: row.id,
    status: row.status,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
