import { NextResponse } from "next/server";
import {
  createBlogCategory,
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
} from "@/lib/db";
import {
  buildExcerptFromText,
  computeReadTime,
  formatDateRu,
  slugify,
} from "@/lib/blog-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    const resolved = ctx.params ? await ctx.params : undefined;
    const id = Number(resolved?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const item = getBlogPostById(id);
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    const resolved = ctx.params ? await ctx.params : undefined;
    const id = Number(resolved?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const body = await req.json();
    const slugInput = typeof body.slug === "string" ? body.slug.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const contentText =
      typeof body.contentText === "string"
        ? body.contentText
        : typeof body.contentHtml === "string"
          ? body.contentHtml
          : "";
    const status = body.status || undefined;
    const date =
      body.date ||
      (status === "published" ? formatDateRu(new Date()) : undefined);
    const readTime =
      body.readTime || (contentText ? computeReadTime(contentText) : undefined);
    const excerpt =
      body.excerpt ||
      body.subtitle ||
      (contentText ? buildExcerptFromText(contentText) : undefined);
    const slug = slugInput || (title ? slugify(title) : undefined);

    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : undefined;
    if (category) createBlogCategory(category);

    const contentJson =
      typeof body.contentJson !== "undefined"
        ? body.contentJson
          ? JSON.stringify(body.contentJson)
          : null
        : contentText
          ? null
          : undefined;

    const result = updateBlogPost(id, {
      slug,
      title,
      subtitle: body.subtitle,
      excerpt,
      category,
      date,
      readTime,
      image: body.image,
      contentText,
      contentJson,
      status,
    });
    return NextResponse.json({ ok: true, changes: result.changes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    const resolved = ctx.params ? await ctx.params : undefined;
    const id = Number(resolved?.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    deleteBlogPost(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
