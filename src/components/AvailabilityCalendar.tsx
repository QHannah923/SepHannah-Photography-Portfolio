"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export type Slot = { id: string; starts_at: string; ends_at: string };
const dateKey = (d: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Brisbane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
export default function AvailabilityCalendar() {
  const [today] = useState(() => dateKey(new Date()));
  const [month, setMonth] = useState(today.slice(0, 7));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const control = new AbortController();
    setLoading(true);
    setError("");
    setSlots([]);
    fetch("/api/availability?month=" + month, { signal: control.signal })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setSlots(d.slots);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(e.message || "Could not load dates");
      })
      .finally(() => {
        if (!control.signal.aborted) setLoading(false);
      });
    return () => control.abort();
  }, [month, retry]);
  const [y, m] = month.split("-").map(Number);
  const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const count = new Date(y, m, 0).getDate();
  function change(n: number) {
    const d = new Date(y, m - 1 + n, 1);
    setMonth(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"));
    setSelected("");
  }
  const time = (x: string) =>
    new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Brisbane",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(x));
  return (
    <div className="availability-layout">
      <div className="calendar" aria-busy={loading}>
        <div className="calendar-top">
          <button
            aria-label="Previous month"
            disabled={month <= today.slice(0, 7)}
            onClick={() => change(-1)}
          >
            ←
          </button>
          <h3>
            {new Date(y, m - 1, 1).toLocaleDateString("en-AU", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            aria-label="Next month"
            disabled={y >= Number(today.slice(0, 4)) + 2 && m === 12}
            onClick={() => change(1)}
          >
            →
          </button>
        </div>
        <div className="calendar-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <span key={d}>{d}</span>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <span key={"blank" + i} />
          ))}
          {Array.from({ length: count }, (_, i) => {
            const key = month + "-" + String(i + 1).padStart(2, "0"),
              available = slots.some(
                (s) => dateKey(new Date(s.starts_at)) === key,
              );
            return (
              <button
                key={key}
                className={
                  "calendar-day " +
                  (available ? "available " : "") +
                  (selected === key ? "selected" : "")
                }
                disabled={!available || loading}
                aria-pressed={selected === key}
                aria-label={
                  key +
                  (available
                    ? " — available to enquire"
                    : " — no published times")
                }
                onClick={() => setSelected(key)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <p className="calendar-legend">
          Green: open for enquiries · Other dates: no published times
          <br />
          All times are Brisbane time (AEST, UTC+10).
        </p>
      </div>
      <div aria-live="polite">
        {loading ? (
          <p>Checking Hannah’s calendar…</p>
        ) : error ? (
          <div className="notice">
            <p>{error}</p>
            <button className="chip" onClick={() => setRetry(retry + 1)}>
              Try again
            </button>
            <Link className="text-link" href="/inquire">
              Ask about a date ↗
            </Link>
          </div>
        ) : slots.length === 0 ? (
          <div className="notice">
            <h3>Let’s find your date.</h3>
            <p>
              No times have been published for this month. This doesn’t
              necessarily mean Hannah is fully booked.
            </p>
            <Link className="text-link" href="/inquire">
              Send your preferred dates ↗
            </Link>
          </div>
        ) : selected ? (
          <>
            <h3>{selected}</h3>
            <p>Choose a time to include in your enquiry.</p>
            {slots
              .filter((s) => dateKey(new Date(s.starts_at)) === selected)
              .map((s) => (
                <Link
                  className="slot-link"
                  key={s.id}
                  href={
                    "/inquire?slot=" +
                    s.id +
                    "&date=" +
                    encodeURIComponent(
                      selected +
                        " · " +
                        time(s.starts_at) +
                        "–" +
                        time(s.ends_at) +
                        " AEST",
                    )
                  }
                >
                  {time(s.starts_at)} – {time(s.ends_at)}{" "}
                  <span>Enquire ↗</span>
                </Link>
              ))}
            <p className="muted">
              Your time is confirmed by Hannah after discussing your session and
              deposit.
            </p>
          </>
        ) : (
          <>
            <h3>A day that works for you.</h3>
            <p>
              Select a highlighted date to see available session windows. For a
              longer wedding or styling session, Hannah will confirm the full
              time needed.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
