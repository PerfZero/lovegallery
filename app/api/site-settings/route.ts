import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ item: getSiteSettings() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load site settings" },
      { status: 500 },
    );
  }
}
