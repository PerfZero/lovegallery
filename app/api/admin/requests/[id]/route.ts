import { NextResponse } from "next/server";
import { updateRequest } from "@/lib/db";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  ctx: { params?: Promise<{ id?: string }> },
) {
  try {
    const resolvedParams = ctx.params ? await ctx.params : undefined;
    const paramId = resolvedParams?.id;
    let id = Number(paramId);
    if (!Number.isFinite(id)) {
      const parts = new URL(req.url).pathname.split("/");
      const last = parts[parts.length - 1];
      id = Number(last);
    }
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const status = typeof body.status === "string" ? body.status : undefined;
    const priority =
      typeof body.priority === "number" ? body.priority : undefined;
    const notes = typeof body.notes === "string" ? body.notes : undefined;

    const result = updateRequest(id, { status, priority, notes });
    return NextResponse.json({ ok: true, changes: result.changes });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 },
    );
  }
}
