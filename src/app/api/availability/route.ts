import { NextResponse } from "next/server";
import { db, privateHeaders } from "@/lib/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const month =
    new URL(req.url).searchParams.get("month") ||
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Australia/Brisbane",
      year: "numeric",
      month: "2-digit",
    }).format(new Date());
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  const [y, m] = month.split("-").map(Number);
  if (y < 2026 || y > new Date().getFullYear() + 2)
    return NextResponse.json(
      { error: "Month is outside the booking window" },
      { status: 400 },
    );
  try {
    const from = new Date(`${month}-01T00:00:00+10:00`).toISOString(),
      to = new Date(Date.UTC(y, m, 1) - 10 * 3600000).toISOString();
    const { data, error } = await db().rpc("studio_available_slots", {
      p_from: from,
      p_to: to,
    });
    if (error) throw error;
    return NextResponse.json(
      { slots: data || [], timezone: "Australia/Brisbane" },
      { headers: privateHeaders },
    );
  } catch {
    return NextResponse.json(
      {
        slots: [],
        error:
          "Live dates are temporarily unavailable. Send your preferred dates to Hannah.",
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
