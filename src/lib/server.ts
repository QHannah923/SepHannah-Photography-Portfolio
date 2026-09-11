import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Database is not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (url, init) =>
        fetch(url, { ...init, signal: AbortSignal.timeout(12000) }),
    },
  });
}
export function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
export function safeEqual(a: string, b: string) {
  return timingSafeEqual(Buffer.from(hash(a)), Buffer.from(hash(b)));
}
export function adminConfigured() {
  return (
    (process.env.STUDIO_ADMIN_PASSWORD?.length || 0) >= 16 &&
    (process.env.STUDIO_SESSION_SECRET?.length || 0) >= 32
  );
}
function sign(value: string) {
  return createHmac("sha256", process.env.STUDIO_SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}
export function newSession() {
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  return expiry + "." + sign(expiry);
}
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get("studio_session")?.value || "";
  const [expiry, signature] = value.split(".");
  return (
    /^\d+$/.test(expiry) &&
    Number(expiry) > Date.now() &&
    Number(expiry) < Date.now() + 9 * 60 * 60 * 1000 &&
    safeEqual(signature || "", sign(expiry))
  );
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  return (
    origin === new URL(req.url).origin ||
    origin === process.env.NEXT_PUBLIC_SITE_URL
  );
}
export async function limit(req: Request, namespace: string, max = 8) {
  const forwarded = process.env.VERCEL
    ? req.headers.get("x-vercel-forwarded-for")
    : req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() || "local";
  const key = hash(namespace + ":" + ip);
  const { data, error } = await db().rpc("studio_rate_limit", {
    p_key: key,
    p_limit: max,
    p_seconds: 900,
  });
  if (error) throw new Error("Rate limit unavailable");
  return data === true;
}
export async function readBody(
  req: Request,
  max = 16000,
): Promise<Record<string, unknown>> {
  if (Number(req.headers.get("content-length") || 0) > max)
    throw new Error("Payload too large");
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Invalid JSON");
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > max) {
      await reader.cancel();
      throw new Error("Payload too large");
    }
    chunks.push(value);
  }
  const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid JSON");
  return value;
}
export function stringField(
  b: Record<string, unknown>,
  key: string,
  max: number,
  required = false,
) {
  const value = b[key];
  if (value == null && !required) return "";
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    (required && !value.trim())
  )
    throw new Error("Please check " + key);
  return value.trim();
}
export const privateHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
