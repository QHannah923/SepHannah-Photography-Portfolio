import { NextResponse } from "next/server";
import {
  db,
  isAdmin,
  readBody,
  sameOrigin,
  stringField,
  privateHeaders,
} from "@/lib/server";
import { notifyInquiry } from "@/lib/notify";
export async function GET() {
  if (!(await isAdmin()))
    return NextResponse.json(
      { error: "Sign in required" },
      { status: 401, headers: privateHeaders },
    );
  try {
    const { data, error } = await db()
      .from("inquiries")
      .select(
        "id,created_at,name,email,phone,wechat,contact_method,session_type,preferred_dates,location,message,status,style,package_id,film,quote_amount,deposit_paid,private_notes,starts_at,ends_at,email_status,source",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return NextResponse.json({ orders: data }, { headers: privateHeaders });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not load enquiries. Check Supabase and apply the studio migration.",
      },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function PATCH(req: Request) {
  if (!(await isAdmin()) || !sameOrigin(req))
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const b = await readBody(req),
      id = stringField(b, "id", 36, true);
    if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid order");
    if (b.action === "retry-email") {
      const sent = await notifyInquiry(id);
      return NextResponse.json(
        {
          ok: sent,
          ...(!sent
            ? {
                error:
                  "Email could not be sent. Check the sender and email service configuration.",
              }
            : {}),
        },
        { status: sent ? 200 : 503, headers: privateHeaders },
      );
    }
    const status = stringField(b, "status", 20, true),
      notes = stringField(b, "notes", 4000),
      start = stringField(b, "start", 50),
      end = stringField(b, "end", 50);
    if (
      ![
        "new",
        "quoted",
        "confirmed",
        "editing",
        "completed",
        "cancelled",
      ].includes(status)
    )
      throw new Error("Invalid status");
    if (
      (start && !Number.isFinite(Date.parse(start))) ||
      (end && !Number.isFinite(Date.parse(end)))
    )
      throw new Error("Invalid session dates");
    const quote = b.quote == null || b.quote === "" ? null : Number(b.quote),
      deposit = Number(b.deposit || 0);
    if (
      (quote !== null &&
        (!Number.isFinite(quote) || quote < 0 || quote > 1000000)) ||
      !Number.isFinite(deposit) ||
      deposit < 0 ||
      deposit > 1000000
    )
      throw new Error("Invalid payment amount");
    const { error } = await db().rpc("studio_update_order", {
      p_id: id,
      p_status: status,
      p_start: start || null,
      p_end: end || null,
      p_quote: quote,
      p_deposit: deposit,
      p_notes: notes,
    });
    if (error) {
      if (error.code === "P0001")
        return NextResponse.json(
          { error: error.message },
          { status: 409, headers: privateHeaders },
        );
      throw new Error("Could not update order");
    }
    return NextResponse.json({ ok: true }, { headers: privateHeaders });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not update order" },
      { status: 400, headers: privateHeaders },
    );
  }
}
