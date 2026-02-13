import { NextResponse } from "next/server";
import { isCatalogPageContent } from "@/lib/catalog-page-content";
import { getCatalogPageContent, saveCatalogPageContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ item: getCatalogPageContent() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load catalog content" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!isCatalogPageContent(body)) {
      return NextResponse.json(
        { error: "Invalid catalog content payload" },
        { status: 400 },
      );
    }

    saveCatalogPageContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update catalog content" },
      { status: 500 },
    );
  }
}
