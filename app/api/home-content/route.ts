import { NextResponse } from "next/server";
import { getHomeContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ item: getHomeContent() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load home content" },
      { status: 500 },
    );
  }
}
