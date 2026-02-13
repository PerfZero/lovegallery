import { NextResponse } from "next/server";
import { getCatalogPageContent } from "@/lib/db";

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
