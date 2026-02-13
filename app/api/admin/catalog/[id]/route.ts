import { NextResponse } from "next/server";
import { ensureCatalogSeeded } from "@/lib/catalog-seed";
import {
  CATALOG_ASPECT_RATIOS,
  CATALOG_CATEGORIES,
  toCatalogAdminItem,
} from "@/lib/catalog-utils";
import {
  deleteCatalogItem,
  getCatalogItemById,
  updateCatalogItem,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function toStringMap(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, val]) => {
      if (typeof val !== "string") return [];
      const normalizedKey = key.trim();
      const normalizedVal = val.trim();
      if (!normalizedKey || !normalizedVal) return [];
      return [[normalizedKey, normalizedVal]];
    }),
  );
}

function normalizeOptions(value: unknown): {
  sizes?: string[];
  finishes?: string[];
  fabrics?: string[];
  finishImages?: Record<string, string>;
  fabricImages?: Record<string, string>;
} | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const sizes = toStringArray(raw.sizes);
  const finishes = toStringArray(raw.finishes);
  const fabrics = toStringArray(raw.fabrics);
  const finishImages = toStringMap(raw.finishImages);
  const fabricImages = toStringMap(raw.fabricImages);

  if (
    sizes.length === 0 &&
    finishes.length === 0 &&
    fabrics.length === 0 &&
    Object.keys(finishImages).length === 0 &&
    Object.keys(fabricImages).length === 0
  ) {
    return null;
  }

  return {
    ...(sizes.length > 0 ? { sizes } : {}),
    ...(finishes.length > 0 ? { finishes } : {}),
    ...(fabrics.length > 0 ? { fabrics } : {}),
    ...(Object.keys(finishImages).length > 0 ? { finishImages } : {}),
    ...(Object.keys(fabricImages).length > 0 ? { fabricImages } : {}),
  };
}

function parsePatchPayload(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const out: {
    slug?: string;
    category?: string;
    title?: string;
    artist?: string | null;
    price?: string;
    image?: string;
    videoSrc?: string | null;
    model3dSrc?: string | null;
    imagesJson?: string | null;
    aspectRatio?: string;
    tagsJson?: string | null;
    description?: string | null;
    isNew?: boolean;
    optionsJson?: string | null;
    status?: string;
    sortOrder?: number;
  } = {};

  if (typeof input.slug === "string") {
    const slug = str(input.slug);
    if (!slug) return null;
    out.slug = slug;
  }

  if (typeof input.category === "string") {
    const category = str(input.category);
    if (!(CATALOG_CATEGORIES as readonly string[]).includes(category)) {
      return null;
    }
    out.category = category;
  }

  if (typeof input.title === "string") {
    const title = str(input.title);
    if (!title) return null;
    out.title = title;
  }

  if (typeof input.price === "string") {
    const price = str(input.price);
    if (!price) return null;
    out.price = price;
  }

  if (typeof input.image === "string") {
    const image = str(input.image);
    if (!image) return null;
    out.image = image;
  }

  if (typeof input.artist !== "undefined") {
    out.artist = str(input.artist) || null;
  }

  if (typeof input.videoSrc !== "undefined") {
    out.videoSrc = str(input.videoSrc) || null;
  }

  if (typeof input.model3dSrc !== "undefined") {
    out.model3dSrc = str(input.model3dSrc) || null;
  }

  if (typeof input.images !== "undefined") {
    const images = toStringArray(input.images);
    out.imagesJson = images.length > 0 ? JSON.stringify(images) : null;
  }

  if (typeof input.aspectRatio === "string") {
    const aspectRatio = str(input.aspectRatio);
    if (!(CATALOG_ASPECT_RATIOS as readonly string[]).includes(aspectRatio)) {
      return null;
    }
    out.aspectRatio = aspectRatio;
  }

  if (typeof input.tags !== "undefined") {
    const tags = toStringArray(input.tags);
    out.tagsJson = tags.length > 0 ? JSON.stringify(tags) : null;
  }

  if (typeof input.description !== "undefined") {
    out.description = str(input.description) || null;
  }

  if (typeof input.isNew !== "undefined") {
    out.isNew = Boolean(input.isNew);
  }

  if (typeof input.options !== "undefined") {
    const options = normalizeOptions(input.options);
    out.optionsJson = options ? JSON.stringify(options) : null;
  }

  if (typeof input.status === "string") {
    out.status = str(input.status) || "active";
  }

  if (typeof input.sortOrder !== "undefined") {
    const sortOrder = Number(input.sortOrder);
    if (!Number.isFinite(sortOrder)) return null;
    out.sortOrder = sortOrder;
  }

  return out;
}

export async function GET(
  _req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    ensureCatalogSeeded();
    const resolved = ctx.params ? await ctx.params : undefined;
    const id = Number(resolved?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const row = getCatalogItemById(id);
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: toCatalogAdminItem(row) });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load catalog item" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    ensureCatalogSeeded();
    const resolved = ctx.params ? await ctx.params : undefined;
    const id = Number(resolved?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const payload = parsePatchPayload(body);
    if (!payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = updateCatalogItem(id, payload);
    return NextResponse.json({ ok: true, changes: result.changes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update catalog item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    ensureCatalogSeeded();
    const resolved = ctx.params ? await ctx.params : undefined;
    const id = Number(resolved?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    deleteCatalogItem(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete catalog item" },
      { status: 500 },
    );
  }
}
