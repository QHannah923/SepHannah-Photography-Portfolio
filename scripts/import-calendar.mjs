import fs from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { parseWorkCalendar } from "../src/lib/calendar.mjs";
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const i = line.indexOf("=");
  if (i > 0)
    process.env[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
}
const file = process.argv[2];
if (!file) throw new Error("Pass a local 工作 .ics file");
const result = parseWorkCalendar(fs.readFileSync(file, "utf8"));
console.log("Future busy periods:", result.busy.length);
console.log("Import range:", result.from, "to", result.until);
if (process.argv.includes("--apply")) {
  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const { error } = await db.rpc("studio_import_calendar", {
    p_events: result.busy.map(({ key, ...e }) => ({
      ...e,
      id: createHash("sha256").update(key).digest("hex"),
    })),
    p_from: result.from,
    p_until: result.until,
  });
  if (error) {
    console.error(error.message);
    process.exitCode = 1;
  } else
    console.log("Calendar import saved; no event titles or notes transmitted.");
}
