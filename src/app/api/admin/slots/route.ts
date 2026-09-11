import { NextResponse } from "next/server";
import {
  db,
  isAdmin,
  sameOrigin,
  readBody,
  stringField,
  privateHeaders,
} from "@/lib/server";
export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const { data, error } = await db()
      .from("availability_slots")
      .select("id,starts_at,ends_at,status")
      .gte("ends_at", new Date().toISOString())
      .order("starts_at")
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ slots: data }, { headers: privateHeaders });
  } catch {
    return NextResponse.json(
      { error: "Could not load availability" },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function POST(req: Request) {
  if (!(await isAdmin()) || !sameOrigin(req))
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const b = await readBody(req, 16000);
    const raw = Array.isArray(b.windows) ? b.windows : [b];
    if (!raw.length || raw.length > 31)
      throw new Error("Choose between 1 and 31 session windows");
    const windows = raw.map((item) => {
      if (!item || typeof item !== "object")
        throw new Error("Invalid session window");
      const start = stringField(
          item as Record<string, unknown>,
          "start",
          50,
          true,
        ),
        end = stringField(item as Record<string, unknown>, "end", 50, true);
      if (
        !Number.isFinite(Date.parse(start)) ||
        !Number.isFinite(Date.parse(end)) ||
        Date.parse(start) < Date.now() ||
        Date.parse(end) <= Date.parse(start) ||
        Date.parse(end) - Date.parse(start) > 86400000
      )
        throw new Error("Choose a future time window, up to 24 hours");
      return { starts_at: start, ends_at: end, status: "available" };
    });
    const { data, error } = await db()
      .from("availability_slots")
      .upsert(windows, {
        onConflict: "starts_at,ends_at",
        ignoreDuplicates: true,
      })
      .select("id");
    if (error) throw new Error("Could not publish the time windows");
    return NextResponse.json(
      { ok: true, created: data?.length || 0 },
      { headers: privateHeaders },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not save the time" },
      { status: 400, headers: privateHeaders },
    );
  }
}
export async function PATCH(req: Request) {
  if (!(await isAdmin()) || !sameOrigin(req))
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const b = await readBody(req, 1000),
      id = stringField(b, "id", 36, true);
    if (!["available", "blocked"].includes(String(b.status)))
      throw new Error("Invalid status");
    const { data, error } = await db()
      .from("availability_slots")
      .update({ status: b.status })
      .eq("id", id)
      .select("id")
      .single();
    if (error || !data) throw new Error("Could not change availability");
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch {
    return NextResponse.json(
      { error: "Could not change availability" },
      { status: 400, headers: privateHeaders },
    );
  }
}
