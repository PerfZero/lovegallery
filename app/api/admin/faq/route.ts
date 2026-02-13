import { NextResponse } from "next/server";
import { isFAQContent } from "@/lib/faq-content";
import { getFAQContent, saveFAQContent } from "@/lib/db";

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!isFAQContent(body)) {
      return NextResponse.json(
        { error: "Invalid faq content payload" },
        { status: 400 },
      );
    }

    saveFAQContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update faq content" },
      { status: 500 },
    );
  }
}
