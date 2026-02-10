import { NextResponse } from "next/server";
import { ensureCatalogSeeded } from "@/lib/catalog-seed";
import { toArtwork } from "@/lib/catalog-utils";
import { listCatalogItems } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    ensureCatalogSeeded();
    const rows = listCatalogItems(2000, "active");
    return NextResponse.json({
      items: rows.map((row) => toArtwork(row)),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load catalog" },
      { status: 500 },
    );
  }
}
