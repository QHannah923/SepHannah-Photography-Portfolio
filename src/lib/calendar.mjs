import ICAL from "ical.js";
// Parse locally or on the authenticated server; return busy ranges only, never event titles.
export function parseWorkCalendar(text, { now = new Date(), days = 730 } = {}) {
  if (typeof text !== "string" || text.length > 2_000_000)
    throw new Error("Choose an iCalendar file smaller than 2 MB.");
  const calendar = new ICAL.Component(ICAL.parse(text));
  if (calendar.name !== "vcalendar")
    throw new Error("This is not an iCalendar file.");
  if (calendar.getFirstPropertyValue("x-wr-calname") !== "工作")
    throw new Error("Export only the iCloud calendar named 工作.");
  for (const zone of calendar.getAllSubcomponents("vtimezone"))
    ICAL.TimezoneService.register(new ICAL.Timezone(zone));
  const components = calendar.getAllSubcomponents("vevent");
  for (const component of components)
    for (const property of component.getAllProperties()) {
      const zone = property.getParameter("tzid");
      if (zone && !ICAL.TimezoneService.has(zone))
        throw new Error(
          "The calendar is missing a timezone definition. Export it again from Apple Calendar.",
        );
    }
  const events = components
    .filter((c) => !c.hasProperty("recurrence-id"))
    .map((c) => new ICAL.Event(c));
  for (const c of components.filter((c) => c.hasProperty("recurrence-id"))) {
    const e = new ICAL.Event(c);
    const parent = events.find((x) => x.uid === e.uid);
    if (parent) parent.relateException(e);
    else events.push(e);
  }
  const from = now.getTime(),
    until = from + days * 86400000,
    busy = [];
  let iterations = 0;
  function instant(t) {
    if (t.isDate || t.zone.tzid === "floating") {
      const date = `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
      return new Date(
        date +
          `T${String(t.hour || 0).padStart(2, "0")}:${String(t.minute || 0).padStart(2, "0")}:${String(t.second || 0).padStart(2, "0")}+10:00`,
      );
    }
    return t.toJSDate();
  }
  function add(e, start, end, key) {
    if (
      e.component.getFirstPropertyValue("status") === "CANCELLED" ||
      e.component.getFirstPropertyValue("transp") === "TRANSPARENT"
    )
      return;
    const s = instant(start),
      t = instant(end);
    if (+t <= from || +s >= until) return;
    if (!Number.isFinite(+s) || !Number.isFinite(+t) || t <= s)
      throw new Error(
        "A calendar event has missing or invalid times. Please correct it before importing.",
      );
    if (+t > from && +s < until)
      busy.push({
        key,
        starts_at: s.toISOString(),
        ends_at: t.toISOString(),
        all_day: start.isDate,
      });
  }
  for (const e of events) {
    if (e.isRecurring()) {
      const iterator = e.iterator();
      for (let next = iterator.next(); next; next = iterator.next()) {
        if (++iterations > 20000)
          throw new Error(
            "Calendar recurrence limit exceeded. Export a smaller calendar.",
          );
        if (+instant(next) > until) break;
        const occurrence = e.getOccurrenceDetails(next);
        add(
          occurrence.item,
          occurrence.startDate,
          occurrence.endDate,
          e.uid + "|" + next.toString(),
        );
      }
    } else add(e, e.startDate, e.endDate, e.uid + "|" + e.startDate.toString());
  }
  return {
    busy: busy.sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
    from: new Date(from).toISOString(),
    until: new Date(until).toISOString(),
    source: "工作",
    imported_at: new Date().toISOString(),
  };
}
