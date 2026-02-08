import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, name);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
