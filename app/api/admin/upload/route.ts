import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

function resolveUploadDirs(): string[] {
  const dirs = new Set<string>();

  // Optional explicit override for production.
  if (process.env.UPLOAD_DIR?.trim()) {
    const envDir = process.env.UPLOAD_DIR.trim();
    dirs.add(
      path.isAbsolute(envDir) ? envDir : path.join(process.cwd(), envDir),
    );
  }

  // Persistent app data dir (recommended for production).
  dirs.add(path.join(process.cwd(), "data", "uploads"));

  // Dev / non-standalone Next runtime.
  dirs.add(path.join(process.cwd(), "public", "uploads"));

  // Common standalone runtime path when app is started from project root.
  dirs.add(
    path.join(process.cwd(), ".next", "standalone", "public", "uploads"),
  );

  return Array.from(dirs);
}

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
    const uploadDirs = resolveUploadDirs();
    let savedCount = 0;

    for (const uploadDir of uploadDirs) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, name);
        fs.writeFileSync(filePath, buffer);
        savedCount += 1;
      } catch (writeErr) {
        console.error(`Upload write failed for ${uploadDir}`, writeErr);
      }
    }

    if (savedCount === 0) {
      return NextResponse.json(
        { error: "Upload failed: no writable upload directories" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
