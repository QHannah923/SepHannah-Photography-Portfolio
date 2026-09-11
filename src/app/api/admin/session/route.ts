import { NextResponse } from "next/server";
import {
  adminConfigured,
  isAdmin,
  newSession,
  safeEqual,
  sameOrigin,
  limit,
  readBody,
  privateHeaders,
} from "@/lib/server";
export async function GET() {
  return NextResponse.json(
    { authenticated: await isAdmin(), configured: adminConfigured() },
    { headers: privateHeaders },
  );
}
export async function POST(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  if (!adminConfigured())
    return NextResponse.json(
      {
        error:
          "Set a studio password (16+ characters) and session secret (32+ characters) in the server environment.",
      },
      { status: 503 },
    );
  try {
    const b = await readBody(req, 1000);
    if (!(await limit(req, "admin-login", 5)))
      return NextResponse.json(
        { error: "Too many attempts. Try again in 15 minutes." },
        { status: 429 },
      );
    if (
      typeof b.password !== "string" ||
      !safeEqual(b.password, process.env.STUDIO_ADMIN_PASSWORD!)
    )
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 },
      );
    const response = NextResponse.json(
      { ok: true },
      { headers: privateHeaders },
    );
    response.cookies.set("studio_session", newSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    return response;
  } catch {
    return NextResponse.json(
      {
        error:
          "Sign-in is temporarily unavailable. Check the database connection and migration.",
      },
      { status: 503 },
    );
  }
}
export async function DELETE(req: Request) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set("studio_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
