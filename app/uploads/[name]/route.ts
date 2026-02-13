import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function contentTypeByExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    case ".glb":
      return "model/gltf-binary";
    case ".gltf":
      return "model/gltf+json";
    default:
      return "application/octet-stream";
  }
}

function resolveReadPaths(fileName: string): string[] {
  const safeName = path.basename(fileName);
  const dirs = new Set<string>();

  if (process.env.UPLOAD_DIR?.trim()) {
    const envDir = process.env.UPLOAD_DIR.trim();
    dirs.add(path.isAbsolute(envDir) ? envDir : path.join(process.cwd(), envDir));
  }

  dirs.add(path.join(process.cwd(), "data", "uploads"));
  dirs.add(path.join(process.cwd(), "public", "uploads"));
  dirs.add(path.join(process.cwd(), ".next", "standalone", "public", "uploads"));

  return Array.from(dirs).map((dir) => path.join(dir, safeName));
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> },
) {
  const { name } = await ctx.params;

  if (!name || name.includes("/") || name.includes("\\")) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const candidates = resolveReadPaths(name);

  for (const candidatePath of candidates) {
    try {
      if (!fs.existsSync(candidatePath)) continue;
      const stat = fs.statSync(candidatePath);
      if (!stat.isFile()) continue;

      const fileBuffer = fs.readFileSync(candidatePath);
      const ext = path.extname(candidatePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentTypeByExt(ext),
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": String(fileBuffer.length),
        },
      });
    } catch (err) {
      console.error("Upload read failed", candidatePath, err);
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
