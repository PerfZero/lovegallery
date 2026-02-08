import { NextResponse } from "next/server";
import {
  createBlogCategory,
  listBlogCategories,
  listBlogPosts,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = listBlogCategories();
    const fromPosts = listBlogPosts(500)
      .map((p: any) => p.category)
      .filter(Boolean);
    const names = new Set<string>([
      ...items.map((i: any) => i.name),
      ...fromPosts,
    ]);
    const merged = Array.from(names)
      .sort((a, b) => a.localeCompare(b, "ru"))
      .map((name, index) => ({
        id: index + 1,
        name,
      }));
    return NextResponse.json({ items: merged });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json(
        { error: "Missing category name" },
        { status: 400 },
      );
    }
    createBlogCategory(name);
    const items = listBlogCategories();
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
