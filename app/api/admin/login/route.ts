import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import {
  hashPassword,
  signToken,
  verifyPassword,
  getCookieOptions,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminEmail || !adminPassword || !adminSecret) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 },
      );
    }

    let user = getUserByEmail(email);

    if (!user) {
      // First login: only allow creating the admin user from env
      if (email !== adminEmail) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }
      const passwordHash = hashPassword(adminPassword);
      createUser(adminEmail, passwordHash, "admin");
      user = getUserByEmail(adminEmail);
    }

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = signToken({ uid: user.id, role: user.role }, adminSecret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_token", token, getCookieOptions());
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
