"use client";
import { useState } from "react";
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function PublishSchedule({
  onPublished,
}: {
  onPublished: () => Promise<void>;
}) {
  const [days, setDays] = useState([1, 2, 3, 4, 5]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function publish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      const from = String(fd.get("from")),
        until = String(fd.get("until")),
        start = String(fd.get("start")),
        end = String(fd.get("end"));
      const first = Date.parse(from + "T00:00:00Z"),
        last = Date.parse(until + "T00:00:00Z");
      if (
        last < first ||
        last - first > 30 * 86400000 ||
        !days.length ||
        end <= start
      )
        throw new Error(
          "Choose up to 31 days, at least one weekday, and an end time after the start.",
        );
      const windows = [];
      for (let time = first; time <= last; time += 86400000) {
        const date = new Date(time);
        if (days.includes(date.getUTCDay())) {
          const key = date.toISOString().slice(0, 10);
          const starts_at = key + "T" + start + ":00+10:00",
            ends_at = key + "T" + end + ":00+10:00";
          if (Date.parse(starts_at) > Date.now())
            windows.push({ start: starts_at, end: ends_at });
        }
      }
      if (!windows.length)
        throw new Error("No future windows match these dates and weekdays.");
      const response = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ windows }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(
        `${result.created} new windows published. Existing windows are preserved; work-calendar and confirmed-order conflicts are hidden automatically.`,
      );
      await onPublished();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="guide-section">
      <h2>Open a few weeks at once.</h2>
      <p>
        Choose the days you want to offer and one session window per day.
        Existing closed windows stay closed. All times are Brisbane time.
      </p>
      <form className="inquiry-form" onSubmit={publish}>
        <div>
          <label htmlFor="batch-from">First day</label>
          <input id="batch-from" type="date" name="from" required />
        </div>
        <div>
          <label htmlFor="batch-until">Last day (up to 31 days)</label>
          <input id="batch-until" type="date" name="until" required />
        </div>
        <div>
          <label htmlFor="batch-start">Daily start</label>
          <input
            id="batch-start"
            type="time"
            name="start"
            defaultValue="09:00"
            required
          />
        </div>
        <div>
          <label htmlFor="batch-end">Daily end</label>
          <input
            id="batch-end"
            type="time"
            name="end"
            defaultValue="17:00"
            required
          />
        </div>
        <div className="chip-row full" aria-label="Days to publish">
          {weekdays.map((day, index) => (
            <button
              type="button"
              key={day}
              className={"chip " + (days.includes(index) ? "active" : "")}
              aria-pressed={days.includes(index)}
              onClick={() =>
                setDays(
                  days.includes(index)
                    ? days.filter((d) => d !== index)
                    : [...days, index],
                )
              }
            >
              {day}
            </button>
          ))}
        </div>
        <button className="button full" disabled={busy}>
          {busy ? "Publishing…" : "Publish these session windows ↗"}
        </button>
      </form>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
