import { NextResponse } from "next/server";
import { isAboutContent } from "@/lib/about-content";
import { getAboutContent, saveAboutContent } from "@/lib/db";

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!isAboutContent(body)) {
      return NextResponse.json(
        { error: "Invalid about content payload" },
        { status: 400 },
      );
    }

    saveAboutContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update about content" },
      { status: 500 },
    );
  }
}
