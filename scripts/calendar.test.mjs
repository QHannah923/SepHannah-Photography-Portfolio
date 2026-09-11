import test from "node:test";
import assert from "node:assert/strict";
import { parseWorkCalendar } from "../src/lib/calendar.mjs";
const now = new Date("2026-09-01T00:00:00Z");
const calendar = (events, name = "工作") =>
  `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nX-WR-CALNAME:${name}\r\n${events}\r\nEND:VCALENDAR`;
const event = (lines) =>
  `BEGIN:VEVENT\r\nUID:fixture-private-id\r\n${lines.join("\r\n")}\r\nSUMMARY:Private client name\r\nDESCRIPTION:Private contact details\r\nEND:VEVENT`;
test("imports busy times without client titles or notes", () => {
  const d = parseWorkCalendar(
    calendar(event(["DTSTART:20260917T000000Z", "DTEND:20260917T010000Z"])),
    { now },
  );
  assert.equal(d.busy[0].starts_at, "2026-09-17T00:00:00.000Z");
  assert.equal(d.busy.length, 1);
  assert.ok(!JSON.stringify(d).includes("Private"));
  assert.deepEqual(Object.keys(d.busy[0]).sort(), [
    "all_day",
    "ends_at",
    "key",
    "starts_at",
  ]);
});
test("floating and all-day dates use Brisbane time", () => {
  const floating = parseWorkCalendar(
    calendar(event(["DTSTART:20260917T090000", "DTEND:20260917T100000"])),
    { now },
  );
  assert.equal(floating.busy[0].starts_at, "2026-09-16T23:00:00.000Z");
  const day = parseWorkCalendar(
    calendar(
      event(["DTSTART;VALUE=DATE:20260917", "DTEND;VALUE=DATE:20260918"]),
    ),
    { now },
  );
  assert.equal(day.busy[0].all_day, true);
  assert.equal(day.busy[0].starts_at, "2026-09-16T14:00:00.000Z");
  assert.equal(day.busy[0].ends_at, "2026-09-17T14:00:00.000Z");
});
test("recurring exclusions do not block cancelled days", () => {
  const d = parseWorkCalendar(
    calendar(
      event([
        "DTSTART:20260917T000000Z",
        "DTEND:20260917T010000Z",
        "RRULE:FREQ=DAILY;COUNT=3",
        "EXDATE:20260918T000000Z",
      ]),
    ),
    { now },
  );
  assert.deepEqual(
    d.busy.map((x) => x.starts_at),
    ["2026-09-17T00:00:00.000Z", "2026-09-19T00:00:00.000Z"],
  );
});
test("recurrence overrides replace original times", () => {
  const master = event([
    "DTSTART:20260917T000000Z",
    "DTEND:20260917T010000Z",
    "RRULE:FREQ=DAILY;COUNT=2",
  ]);
  const override = event([
    "RECURRENCE-ID:20260918T000000Z",
    "DTSTART:20260918T030000Z",
    "DTEND:20260918T040000Z",
  ]);
  const d = parseWorkCalendar(calendar(master + "\r\n" + override), { now });
  assert.equal(d.busy.length, 2);
  assert.equal(d.busy[1].starts_at, "2026-09-18T03:00:00.000Z");
});
test("cancelled, transparent, and past events do not block bookings", () => {
  for (const status of ["STATUS:CANCELLED", "TRANSP:TRANSPARENT"])
    assert.equal(
      parseWorkCalendar(
        calendar(
          event(["DTSTART:20260917T000000Z", "DTEND:20260917T010000Z", status]),
        ),
        { now },
      ).busy.length,
      0,
    );
  assert.equal(
    parseWorkCalendar(
      calendar(event(["DTSTART:20250101T000000Z", "DTEND:20250101T000000Z"])),
      { now },
    ).busy.length,
    0,
  );
});
test("rejects unrelated calendars and malformed future times", () => {
  assert.throws(() => parseWorkCalendar(calendar("", "家庭"), { now }), /工作/);
  assert.throws(
    () =>
      parseWorkCalendar(
        calendar(event(["DTSTART:20260917T000000Z", "DTEND:20260917T000000Z"])),
        { now },
      ),
    /invalid times/,
  );
});

test("rejects unknown timezones rather than guessing availability", () => {
  assert.throws(
    () =>
      parseWorkCalendar(
        calendar(
          event([
            "DTSTART;TZID=Missing/Timezone:20260917T090000",
            "DTEND;TZID=Missing/Timezone:20260917T100000",
          ]),
        ),
        { now },
      ),
    /timezone definition/,
  );
});
