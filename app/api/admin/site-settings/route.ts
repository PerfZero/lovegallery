import { NextResponse } from "next/server";
import { getSiteSettings, saveSiteSettings } from "@/lib/db";
import { isSiteSettings } from "@/lib/site-settings";

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

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!isSiteSettings(body)) {
      return NextResponse.json(
        { error: "Invalid site settings payload" },
        { status: 400 },
      );
    }

    saveSiteSettings(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 },
    );
  }
}
