import { NextResponse } from "next/server";
import { getAboutContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ item: getAboutContent() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load about content" },
      { status: 500 },
    );
  }
}
