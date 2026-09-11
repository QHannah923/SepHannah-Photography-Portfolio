"use client";
import { useEffect, useState } from "react";
type Busy = { starts_at: string; ends_at: string; all_day: boolean };
const time = (s: string) =>
  new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(s));
export default function CalendarImport() {
  const [ics, setIcs] = useState("");
  const [preview, setPreview] = useState<{
    count: number;
    busy: Busy[];
  } | null>(null);
  const [state, setState] = useState<{
    imported_at: string;
    event_count: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<Busy[]>([]);
  async function load() {
    try {
      const r = await fetch("/api/admin/calendar");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setState(d.sync);
      setEvents(d.busy);
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function read(file?: File) {
    setPreview(null);
    setMessage("");
    if (!file) return;
    if (file.size > 2000000) {
      setMessage("Choose a file smaller than 2 MB");
      return;
    }
    setBusy(true);
    try {
      const content = await file.text();
      const r = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ics: content, preview: true }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setIcs(content);
      setPreview(d);
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ics }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessage(d.count + " busy periods imported. Only times were saved.");
      setPreview(null);
      setIcs("");
      await load();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="guide-section">
      <p className="eyebrow">ICLOUD / WORK CALENDAR</p>
      <h2>Your existing schedule.</h2>
      <p>
        Export the calendar named 工作 from Apple Calendar, then import the .ics
        file here. Only busy times are saved; event names and notes stay
        private. This is a snapshot: reimport after changing your iPhone
        calendar.
      </p>
      {state ? (
        <p className="notice">
          Last import: {time(state.imported_at)} · {state.event_count} busy
          periods.{" "}
          {Date.now() - Date.parse(state.imported_at) > 7 * 86400000
            ? "Refresh your calendar import before opening new dates."
            : ""}
        </p>
      ) : (
        <p>No calendar snapshot imported yet.</p>
      )}
      <label className="text-link">
        Choose your 工作 calendar (.ics)
        <input
          type="file"
          accept=".ics,text/calendar"
          onChange={(e) => read(e.target.files?.[0])}
          disabled={busy}
        />
      </label>
      {preview && (
        <div className="notice">
          <p>
            {preview.count} busy periods found for the next two years. This
            replaces the previous imported calendar snapshot; studio orders
            remain unchanged.
          </p>
          <button className="button" onClick={save} disabled={busy}>
            Import these busy times
          </button>
        </div>
      )}
      {message && <p role="status">{message}</p>}
      <details className="faq">
        <summary>Review imported busy times</summary>
        {events.map((e, i) => (
          <p key={i}>
            {time(e.starts_at)} — {time(e.ends_at)}
            {e.all_day ? " · All day" : ""}
          </p>
        ))}
      </details>
    </section>
  );
}
