import fs from "node:fs";
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=");
  if (i > 0)
    process.env[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("Supabase configuration missing");
  process.exit(1);
}
try {
  const r = await fetch(`${url}/rest/v1/inquiries?select=id&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  console.log("Supabase inquiries table read check:", r.status);
  const a = await fetch(`${url}/rest/v1/availability_slots?select=id&limit=0`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(15000),
  });
  console.log("Supabase availability table check:", a.status);
} catch (e) {
  console.log("Connection failed:", e.cause?.code || e.name);
  process.exitCode = 1;
}
