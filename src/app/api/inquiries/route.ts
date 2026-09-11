import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import {
  db,
  hash,
  limit,
  readBody,
  stringField,
  sameOrigin,
  privateHeaders,
} from "@/lib/server";
import { packages, styles } from "@/lib/studio";
import { notifyInquiry } from "@/lib/notify";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(req: Request) {
  try {
    if (!sameOrigin(req))
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403 },
      );
    const b = await readBody(req);
    if (b.website)
      return NextResponse.json({ ok: true }, { headers: privateHeaders });
    const name = stringField(b, "name", 100, true),
      email = stringField(b, "email", 254),
      wechat = stringField(b, "wechat", 100),
      phone = stringField(b, "phone", 40),
      contact = stringField(b, "contactMethod", 20) || "email";
    if (!["email", "wechat"].includes(contact))
      throw new Error("Choose email or WeChat");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Please enter a valid email");
    if ((contact === "email" && !email) || (contact === "wechat" && !wechat))
      throw new Error("Please provide your preferred contact details");
    if (b.consent !== true)
      throw new Error("Please agree to the enquiry privacy notice");
    const session = stringField(b, "sessionType", 30, true);
    if (
      !["wedding", "graduation", "registry", "portrait", "other"].includes(
        session,
      )
    )
      throw new Error("Invalid session type");
    const packageId = stringField(b, "packageId", 50),
      style = stringField(b, "style", 30);
    const selected = packages.find((p) => p.id === packageId);
    if (packageId && (!selected || selected.group !== session))
      throw new Error("The selected package does not match the session");
    if (style && !styles.some((s) => s.id === style))
      throw new Error("Invalid photography style");
    const requestId = stringField(b, "requestId", 36, true);
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        requestId,
      )
    )
      throw new Error("Invalid request reference");
    const preferredDates = stringField(b, "preferredDates", 500),
      location = stringField(b, "location", 250),
      message = stringField(b, "message", 4000),
      slotId = stringField(b, "slotId", 36);
    if (slotId && !/^[0-9a-f-]{36}$/i.test(slotId))
      throw new Error("Invalid time slot");
    if (!(await limit(req, "inquiry", 8)))
      return NextResponse.json(
        { error: "Please wait a little before sending another enquiry." },
        { status: 429 },
      );
    const database = db();
    const token = createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY!)
      .update("studio-tracking:" + requestId)
      .digest("hex");
    const { data: existing, error: existingError } = await database
      .from("inquiries")
      .select("id,tracking_hash")
      .eq("request_id", requestId)
      .maybeSingle();
    if (existingError) throw new Error("SERVICE_UNAVAILABLE");
    if (existing) {
      if (existing.tracking_hash !== hash(token))
        return NextResponse.json(
          { error: "Please start a new enquiry." },
          { status: 409 },
        );
      return NextResponse.json(
        {
          ok: true,
          reference: existing.id,
          trackingToken: token,
          duplicate: true,
        },
        { headers: privateHeaders },
      );
    }
    let slot = null;
    if (slotId) {
      const { data, error } = await database.rpc("studio_available_slots", {
        p_from: new Date().toISOString(),
        p_to: new Date(Date.now() + 2 * 366 * 86400000).toISOString(),
      });
      if (error) throw new Error("SERVICE_UNAVAILABLE");
      slot = data?.find((s: { id: string }) => s.id === slotId);
      if (!slot)
        return NextResponse.json(
          {
            error:
              "That time is no longer available. Please choose another time.",
          },
          { status: 409 },
        );
    }
    const { data, error } = await database
      .from("inquiries")
      .insert({
        name,
        email,
        phone: phone || null,
        wechat: wechat || null,
        contact_method: contact,
        session_type: session,
        preferred_dates: slot
          ? `${slot.starts_at} to ${slot.ends_at} (Brisbane)`
          : preferredDates || null,
        location: location || null,
        message: message || null,
        style: style || null,
        package_id: packageId || null,
        film: b.film === true,
        source: b.source === "miniprogram" ? "miniprogram" : "website",
        tracking_hash: hash(token),
        request_id: requestId,
        slot_id: slotId || null,
        starts_at: slot?.starts_at || null,
        ends_at: slot?.ends_at || null,
      })
      .select("id")
      .single();
    if (error) {
      if (error.code === "23505")
        return NextResponse.json(
          { ok: true, trackingToken: token, duplicate: true },
          { headers: privateHeaders },
        );
      throw new Error("SERVICE_UNAVAILABLE");
    }
    const notified = await notifyInquiry(data.id);
    return NextResponse.json(
      { ok: true, reference: data.id, trackingToken: token, notified },
      { headers: privateHeaders },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    const validation =
      /^(Please|Choose|Invalid|The selected|Payload|Unexpected|Expected)/.test(
        message,
      );
    return NextResponse.json(
      {
        error: validation
          ? message
          : "The booking service is temporarily unavailable. Please email the studio directly.",
      },
      { status: validation ? 400 : 503, headers: privateHeaders },
    );
  }
}
