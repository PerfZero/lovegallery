import { NextResponse } from "next/server";
import { ensureBlogSeeded } from "@/lib/blog-seed";
import { listBlogPosts } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    ensureBlogSeeded();
    const items = listBlogPosts(500).filter((p: any) => p.status === "published");
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}
