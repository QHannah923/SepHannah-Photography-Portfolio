import fs from "node:fs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=");
  if (i > 0)
    process.env[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
}
const base = "http://127.0.0.1:3000";
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const requestId = randomUUID();
let cookie = "",
  orderId = "",
  slotId = "";
async function call(path, method = "GET", body, authenticated = false) {
  const response = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authenticated ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(45000),
  });
  return {
    status: response.status,
    data: await response.json(),
    cookie: response.headers.get("set-cookie"),
  };
}
const update = (fields = {}) => ({
  id: orderId,
  status: "confirmed",
  start: "",
  end: "",
  quote: 339,
  deposit: 40,
  notes: "Automated studio verification fixture",
  ...fields,
});
try {
  assert.equal((await call("/api/admin/orders")).status, 401);
  assert.equal((await call("/api/admin/calendar")).status, 401);
  assert.equal((await call("/api/admin/slots")).status, 401);
  console.log(
    "PASS: client records and calendar details require studio sign-in",
  );
  const login = await call("/api/admin/session", "POST", {
    password: process.env.STUDIO_ADMIN_PASSWORD,
  });
  assert.equal(login.status, 200);
  cookie = login.cookie.split(";")[0];
  assert.equal(
    (await call("/api/admin/session", "GET", undefined, true)).data
      .authenticated,
    true,
  );
  assert.equal((await call("/api/availability?month=invalid")).status, 400);
  const missing = await call("/api/inquiries", "POST", {
    name: "Verification",
  });
  assert.equal(missing.status, 400);
  console.log("PASS: login, invalid dates and incomplete enquiries");
  const body = {
    name: "[STUDIO CHECK] Disposable verification",
    email: "studio-check@example.invalid",
    sessionType: "graduation",
    packageId: "grad-90",
    style: "airy",
    consent: true,
    requestId,
    contactMethod: "email",
  };
  const created = await call("/api/inquiries", "POST", body);
  assert.equal(created.status, 200);
  orderId = created.data.reference;
  assert.ok(orderId);
  assert.match(created.data.trackingToken, /^[0-9a-f]{64}$/);
  const retry = await call("/api/inquiries", "POST", body);
  assert.equal(retry.status, 200);
  assert.equal(retry.data.reference, orderId);
  assert.equal(retry.data.trackingToken, created.data.trackingToken);
  const tracked = await call("/api/bookings/status", "POST", {
    token: created.data.trackingToken,
  });
  assert.equal(tracked.status, 200);
  assert.equal(tracked.data.order.status, "new");
  for (const key of [
    "name",
    "email",
    "wechat",
    "private_notes",
    "tracking_hash",
  ])
    assert.equal(key in tracked.data.order, false);
  console.log(
    "PASS: enquiry saved, retry deduplicated, private tracking code works without contact-data disclosure",
  );
  assert.equal(
    (await call("/api/admin/orders", "PATCH", update(), true)).status,
    409,
  );
  const calendar = await call("/api/admin/calendar", "GET", undefined, true);
  assert.equal(calendar.status, 200);
  assert.ok(calendar.data.sync?.event_count > 0);
  if (calendar.data.busy.length) {
    const b = calendar.data.busy[0];
    assert.equal(
      (
        await call(
          "/api/admin/orders",
          "PATCH",
          update({ start: b.starts_at, end: b.ends_at }),
          true,
        )
      ).status,
      409,
    );
  }
  console.log(
    "PASS: confirmation needs session times and rejects work-calendar overlaps",
  );
  let start = Date.now() + 365 * 86400000;
  const { data: existing, error: existingError } = await db
    .from("inquiries")
    .select("starts_at,ends_at")
    .in("status", ["confirmed", "editing", "completed"]);
  assert.ifError(existingError);
  const occupied = [...calendar.data.busy, ...existing];
  while (
    occupied.some(
      (b) =>
        Date.parse(b.starts_at) < start + 3600000 &&
        Date.parse(b.ends_at) > start,
    )
  )
    start += 86400000;
  const startISO = new Date(start).toISOString(),
    endISO = new Date(start + 3600000).toISOString();
  const slot = await call(
    "/api/admin/slots",
    "POST",
    { start: startISO, end: endISO },
    true,
  );
  assert.equal(slot.status, 200);
  const { data: fixture, error: fixtureError } = await db
    .from("availability_slots")
    .select("id")
    .eq("starts_at", startISO)
    .eq("ends_at", endISO)
    .single();
  assert.ifError(fixtureError);
  slotId = fixture.id;
  const month = new Date(start + 36000000).toISOString().slice(0, 7);
  assert.ok(
    (await call("/api/availability?month=" + month)).data.slots.some(
      (s) => s.id === slotId,
    ),
  );
  assert.equal(
    (
      await call(
        "/api/admin/orders",
        "PATCH",
        update({ start: startISO, end: endISO }),
        true,
      )
    ).status,
    200,
  );
  assert.ok(
    !(await call("/api/availability?month=" + month)).data.slots.some(
      (s) => s.id === slotId,
    ),
  );
  assert.equal(
    (
      await call(
        "/api/admin/orders",
        "PATCH",
        update({ status: "cancelled", start: startISO, end: endISO }),
        true,
      )
    ).status,
    200,
  );
  assert.ok(
    (await call("/api/availability?month=" + month)).data.slots.some(
      (s) => s.id === slotId,
    ),
  );
  console.log(
    "PASS: confirmed orders hide occupied slots; cancellation releases them",
  );
  if (!process.env.RESEND_API_KEY || !process.env.STUDIO_FROM_EMAIL)
    console.log(
      "PENDING: email delivery needs Resend API key and verified sender; enquiry storage remains operational",
    );
  await call("/api/admin/session", "DELETE", undefined, true);
  console.log("PASS: studio sign-out");
} finally {
  // Delete only IDs created by this run, never client records or previously published slots.
  const { error: orderError } = await db
    .from("inquiries")
    .delete()
    .eq("request_id", requestId);
  assert.ifError(orderError);
  if (slotId) {
    const { error } = await db
      .from("availability_slots")
      .delete()
      .eq("id", slotId);
    assert.ifError(error);
  }
  console.log("Verification fixtures removed.");
}
