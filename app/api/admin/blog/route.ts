import { NextResponse } from "next/server";
import { createBlogCategory, createBlogPost, listBlogPosts } from "@/lib/db";
import { ensureBlogSeeded } from "@/lib/blog-seed";
import {
  buildExcerptFromText,
  computeReadTime,
  formatDateRu,
  slugify,
} from "@/lib/blog-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    ensureBlogSeeded();
    const items = listBlogPosts(500);
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load blog posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slugInput = String(body.slug || "").trim();
    const title = String(body.title || "").trim();
    const slug = slugInput || slugify(title);
    if (!slug || !title) {
      return NextResponse.json(
        { error: "Missing slug/title" },
        { status: 400 },
      );
    }

    const contentText = String(body.contentText || body.contentHtml || "");
    const status = body.status || "published";
    const date =
      body.date || (status === "published" ? formatDateRu(new Date()) : null);
    const readTime = body.readTime || computeReadTime(contentText);
    const excerpt =
      body.excerpt || body.subtitle || buildExcerptFromText(contentText);
    const categoryValue = String(body.category || "").trim();
    const category = categoryValue || undefined;
    if (category) createBlogCategory(category);

    const result = createBlogPost({
      slug,
      title,
      subtitle: body.subtitle || null,
      excerpt,
      category,
      date,
      readTime,
      image: body.image || null,
      contentText,
      contentJson: body.contentJson ? JSON.stringify(body.contentJson) : null,
      status,
    });

    return NextResponse.json({ ok: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
