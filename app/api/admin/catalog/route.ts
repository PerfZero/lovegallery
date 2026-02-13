import { NextResponse } from "next/server";
import { ensureCatalogSeeded } from "@/lib/catalog-seed";
import {
  CATALOG_ASPECT_RATIOS,
  CATALOG_CATEGORIES,
  toCatalogAdminItem,
} from "@/lib/catalog-utils";
import { createCatalogItem, listCatalogItems } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ParsedCatalogPayload = {
  slug: string;
  category: string;
  title: string;
  artist: string | null;
  price: string;
  image: string;
  videoSrc: string | null;
  model3dSrc: string | null;
  imagesJson: string | null;
  aspectRatio: string;
  tagsJson: string | null;
  description: string | null;
  isNew: boolean;
  optionsJson: string | null;
  status: string;
  sortOrder: number;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeOptions(value: unknown): Record<string, string[]> | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const sizes = toStringArray(raw.sizes);
  const finishes = toStringArray(raw.finishes);
  const fabrics = toStringArray(raw.fabrics);

  if (sizes.length === 0 && finishes.length === 0 && fabrics.length === 0) {
    return null;
  }

  return {
    ...(sizes.length > 0 ? { sizes } : {}),
    ...(finishes.length > 0 ? { finishes } : {}),
    ...(fabrics.length > 0 ? { fabrics } : {}),
  };
}

function normalizePayload(body: unknown): ParsedCatalogPayload | null {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;

  const slug = str(input.slug || input.id);
  const category = str(input.category);
  const title = str(input.title);
  const price = str(input.price);
  const image = str(input.image);
  const aspectRatio = str(input.aspectRatio || "square");
  const status = str(input.status || "active");

  if (!slug || !category || !title || !price || !image) return null;
  if (!(CATALOG_CATEGORIES as readonly string[]).includes(category))
    return null;
  if (!(CATALOG_ASPECT_RATIOS as readonly string[]).includes(aspectRatio))
    return null;

  const images = toStringArray(input.images);
  const tags = toStringArray(input.tags);
  const options = normalizeOptions(input.options);
  const parsedSortOrder = Number(input.sortOrder);

  return {
    slug,
    category,
    title,
    artist: str(input.artist) || null,
    price,
    image,
    videoSrc: str(input.videoSrc) || null,
    model3dSrc: str(input.model3dSrc) || null,
    imagesJson: images.length > 0 ? JSON.stringify(images) : null,
    aspectRatio,
    tagsJson: tags.length > 0 ? JSON.stringify(tags) : null,
    description: str(input.description) || null,
    isNew: Boolean(input.isNew),
    optionsJson: options ? JSON.stringify(options) : null,
    status: status || "active",
    sortOrder: Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0,
  };
}

export async function GET() {
  try {
    ensureCatalogSeeded();
    const rows = listCatalogItems(1000);
    return NextResponse.json({
      items: rows.map((row) => toCatalogAdminItem(row)),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load catalog items" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    ensureCatalogSeeded();
    const body = await req.json();
    const payload = normalizePayload(body);

    if (!payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = createCatalogItem(payload);
    return NextResponse.json({ ok: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create catalog item" },
      { status: 500 },
    );
  }
}
