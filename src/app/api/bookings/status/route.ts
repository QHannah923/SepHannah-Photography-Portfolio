import { NextResponse } from "next/server";
import { db, hash, readBody, stringField, privateHeaders } from "@/lib/server";
export async function POST(req: Request) {
  try {
    const b = await readBody(req, 1000),
      token = stringField(b, "token", 64, true);
    if (!/^[a-f0-9]{64}$/.test(token))
      return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    const { data, error } = await db()
      .from("inquiries")
      .select(
        "id,status,session_type,package_id,style,film,starts_at,ends_at,quote_amount,deposit_paid,created_at",
      )
      .eq("tracking_hash", hash(token))
      .maybeSingle();
    if (error) throw error;
    if (!data)
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404, headers: privateHeaders },
      );
    return NextResponse.json({ order: data }, { headers: privateHeaders });
  } catch {
    return NextResponse.json(
      { error: "Could not load your request" },
      { status: 503, headers: privateHeaders },
    );
  }
}
