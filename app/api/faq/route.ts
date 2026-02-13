import { NextResponse } from "next/server";
import { getFAQContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ item: getFAQContent() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load faq content" },
      { status: 500 },
    );
  }
}
