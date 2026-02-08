import { NextResponse } from "next/server";
import { listRequests } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = listRequests(200);
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load requests" },
      { status: 500 },
    );
  }
}
