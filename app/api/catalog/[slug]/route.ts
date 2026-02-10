import { NextResponse } from "next/server";
import { ensureCatalogSeeded } from "@/lib/catalog-seed";
import { toArtwork } from "@/lib/catalog-utils";
import { getCatalogItemBySlug } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params?: Promise<{ slug?: string }> },
) {
  try {
    ensureCatalogSeeded();
    const resolved = ctx.params ? await ctx.params : undefined;
    const slug = String(resolved?.slug || "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const row = getCatalogItemBySlug(slug);
    if (!row || row.status !== "active") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ item: toArtwork(row) });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load item" },
      { status: 500 },
    );
  }
}
