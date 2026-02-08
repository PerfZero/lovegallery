import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/admin/login", "/api/admin/login"];

function base64urlToUint8Array(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 ? 4 - (base64.length % 4) : 0;
  const base64Padded = base64 + "=".repeat(pad);
  const raw = atob(base64Padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function base64urlToString(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 ? 4 - (base64.length % 4) : 0;
  return atob(base64 + "=".repeat(pad));
}

async function verifyToken(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [headerB64, payloadB64, signatureB64] = parts;
  const data = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const signature = base64urlToUint8Array(signatureB64);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    new TextEncoder().encode(data),
  );
  if (!ok) return false;

  try {
    const payload = JSON.parse(base64urlToString(payloadB64));
    if (typeof payload.exp === "number" && Date.now() / 1000 > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    const secret = process.env.ADMIN_SECRET;
    if (!token || !secret) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const ok = await verifyToken(token, secret);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
