import { NextResponse } from "next/server";
import db from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const totalRequests = db
      .prepare("SELECT COUNT(*) as count FROM requests")
      .get()?.count as number;
    const newRequests = db
      .prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'new'")
      .get()?.count as number;
    const processingRequests = db
      .prepare(
        "SELECT COUNT(*) as count FROM requests WHERE status = 'processing'",
      )
      .get()?.count as number;
    const archivedRequests = db
      .prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'done'")
      .get()?.count as number;

    const publishedPosts = db
      .prepare(
        "SELECT COUNT(*) as count FROM blog_posts WHERE status = 'published'",
      )
      .get()?.count as number;

    const totalPosts = db
      .prepare("SELECT COUNT(*) as count FROM blog_posts")
      .get()?.count as number;

    const categories = db
      .prepare(
        "SELECT COUNT(DISTINCT category) as count FROM blog_posts WHERE category IS NOT NULL AND category != ''",
      )
      .get()?.count as number;

    const recent = db
      .prepare(
        `SELECT id, name, email, phone, form_type, product, subject, created_at, status
         FROM requests
         ORDER BY datetime(created_at) DESC
         LIMIT 6`,
      )
      .all();

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const rows = db
      .prepare(
        `SELECT date(created_at) as day, COUNT(*) as count
         FROM requests
         WHERE date(created_at) >= date('now','-6 days')
         GROUP BY date(created_at)`,
      )
      .all() as { day: string; count: number }[];

    const map = new Map(rows.map((r) => [r.day, r.count]));
    const series: { day: string; count: number }[] = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = toIsoDate(d);
      series.push({ day: key, count: map.get(key) || 0 });
    }

    return NextResponse.json({
      stats: {
        totalRequests,
        newRequests,
        processingRequests,
        archivedRequests,
        publishedPosts,
        totalPosts,
        categories,
      },
      recent,
      series,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 },
    );
  }
}
