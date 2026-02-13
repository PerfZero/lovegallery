import { NextResponse } from "next/server";
import { isHomeContent } from "@/lib/home-content";
import { getHomeContent, saveHomeContent } from "@/lib/db";

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!isHomeContent(body)) {
      return NextResponse.json(
        { error: "Invalid home content payload" },
        { status: 400 },
      );
    }

    saveHomeContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update home content" },
      { status: 500 },
    );
  }
}
