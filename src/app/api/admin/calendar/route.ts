import { NextResponse } from "next/server";
import {
  db,
  isAdmin,
  sameOrigin,
  readBody,
  hash,
  privateHeaders,
} from "@/lib/server";
import { parseWorkCalendar } from "@/lib/calendar.mjs";
export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const [state, busy] = await Promise.all([
      db()
        .from("studio_calendar_sync")
        .select("imported_at,range_start,range_end,event_count")
        .eq("id", true)
        .maybeSingle(),
      db()
        .from("studio_calendar_busy")
        .select("starts_at,ends_at,all_day")
        .gte("ends_at", new Date().toISOString())
        .order("starts_at")
        .limit(500),
    ]);
    if (state.error || busy.error) throw new Error();
    return NextResponse.json(
      { sync: state.data, busy: busy.data },
      { headers: privateHeaders },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Apply the calendar migration to enable work-calendar imports.",
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function POST(req: Request) {
  if (!(await isAdmin()) || !sameOrigin(req))
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const b = await readBody(req, 2100000);
    if (typeof b.ics !== "string")
      throw new Error("Choose an iCalendar export");
    const result = parseWorkCalendar(b.ics);
    if (b.preview === true)
      return NextResponse.json(
        {
          count: result.busy.length,
          from: result.from,
          until: result.until,
          busy: result.busy.map(({ starts_at, ends_at, all_day }) => ({
            starts_at,
            ends_at,
            all_day,
          })),
        },
        { headers: privateHeaders },
      );
    const { error } = await db().rpc("studio_import_calendar", {
      p_events: result.busy.map(({ key, ...event }) => ({
        ...event,
        id: hash(key),
      })),
      p_from: result.from,
      p_until: result.until,
    });
    if (error)
      throw new Error(
        "Could not import your calendar. Check the calendar migration.",
      );
    return NextResponse.json(
      { ok: true, count: result.busy.length },
      { headers: privateHeaders },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not import calendar" },
      { status: 400, headers: privateHeaders },
    );
  }
}
