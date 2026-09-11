"use client";
import { useState } from "react";
export default function BookingStatus() {
  const [result, setResult] = useState<Record<string, string | number> | null>(
    null,
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/bookings/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: new FormData(e.currentTarget).get("token"),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setResult(d.order);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form className="inquiry-form" onSubmit={check}>
        <div className="full">
          <label htmlFor="token">Your private tracking code</label>
          <input
            id="token"
            name="token"
            required
            pattern="[a-f0-9]{64}"
            maxLength={64}
            autoComplete="off"
          />
        </div>
        <button disabled={busy} className="button full">
          {busy ? "Checking…" : "Check my request ↗"}
        </button>
      </form>
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <div className="notice" role="status">
          <h3>
            {String(result.status).replace(/\b\w/g, (c) => c.toUpperCase())}
          </h3>
          <p>
            {result.session_type} · Reference{" "}
            {String(result.id).slice(0, 8).toUpperCase()}
          </p>
          <p>
            {result.starts_at
              ? new Intl.DateTimeFormat("en-AU", {
                  timeZone: "Australia/Brisbane",
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(String(result.starts_at))) +
                " (Brisbane time)"
              : "Date to be confirmed"}
          </p>
          <p>
            {result.quote_amount != null
              ? "Quote: A$" + result.quote_amount
              : "Quote to be confirmed"}{" "}
            · Deposit recorded: A${result.deposit_paid || 0}
          </p>
          <p>
            A date is reserved only when your request is confirmed by Hannah.
          </p>
        </div>
      )}
    </>
  );
}
