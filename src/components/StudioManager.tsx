"use client";
import { useEffect, useState, useRef } from "react";
import CalendarImport from "./CalendarImport";
import PublishSchedule from "./PublishSchedule";
import { packages, studio } from "@/lib/studio";
type Order = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  wechat: string | null;
  contact_method: string;
  session_type: string;
  preferred_dates: string | null;
  location: string | null;
  message: string | null;
  status: string;
  style: string | null;
  package_id: string | null;
  film: boolean;
  quote_amount: number | null;
  deposit_paid: number;
  private_notes: string | null;
  starts_at: string | null;
  ends_at: string | null;
  email_status: string;
  source: string;
};
type Slot = { id: string; starts_at: string; ends_at: string; status: string };
const statuses = [
  "new",
  "quoted",
  "confirmed",
  "editing",
  "completed",
  "cancelled",
];
const localTime = (s: string | null) =>
  s ? new Date(Date.parse(s) + 36000000).toISOString().slice(0, 16) : "";
const prettyTime = (s: string) =>
  new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Brisbane",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(s));
async function api(path: string, method = "GET", body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
export default function StudioManager() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [tab, setTab] = useState("orders");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const editor = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected) return;
    const dialog = editor.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
    };
  }, [selected]);
  useEffect(() => {
    api("/api/admin/session")
      .then((d) => {
        setAuth(d.authenticated);
        setConfigured(d.configured);
      })
      .catch((e) => {
        setAuth(false);
        setError(e.message);
      });
  }, []);
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [o, s] = await Promise.all([
        api("/api/admin/orders"),
        api("/api/admin/slots"),
      ]);
      setOrders(o.orders);
      setSlots(s.slots);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (auth) refresh();
  }, [auth]);
  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/session", "POST", {
        password: new FormData(e.currentTarget).get("password"),
      });
      setAuth(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await api("/api/admin/session", "DELETE");
      setAuth(false);
      setOrders([]);
      setSlots([]);
      setSelected(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function saveOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);
    const start = String(fd.get("start") || ""),
      end = String(fd.get("end") || "");
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api("/api/admin/orders", "PATCH", {
        id: selected.id,
        status: fd.get("status"),
        start: start ? start + ":00+10:00" : "",
        end: end ? end + ":00+10:00" : "",
        quote: fd.get("quote"),
        deposit: fd.get("deposit"),
        notes: fd.get("notes"),
      });
      setNotice(
        "Order updated. Public availability reflects confirmed session times.",
      );
      setSelected(null);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function publishSlot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget,
      fd = new FormData(form);
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/slots", "POST", {
        start: fd.get("start") + ":00+10:00",
        end: fd.get("end") + ":00+10:00",
      });
      form.reset();
      setNotice("Time window published.");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleSlot(s: Slot) {
    setBusy(true);
    try {
      await api("/api/admin/slots", "PATCH", {
        id: s.id,
        status: s.status === "available" ? "blocked" : "available",
      });
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function retryEmail(id: string) {
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/orders", "PATCH", { id, action: "retry-email" });
      setNotice("Notification sent to the studio.");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function copyReply(o: Order) {
    setError("");
    const p = packages.find((p) => p.id === o.package_id);
    let dates = "";
    if (
      o.starts_at &&
      ["confirmed", "editing", "completed"].includes(o.status)
    ) {
      dates = "Your confirmed session: " + prettyTime(o.starts_at);
    } else {
      try {
        const now = new Date(Date.now() + 36000000);
        const months = [0, 1].map((offset) =>
          new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1),
          )
            .toISOString()
            .slice(0, 7),
        );
        const results = await Promise.all(
          months.map((month) => api("/api/availability?month=" + month)),
        );
        const open = results
          .flatMap((result) => result.slots as Slot[])
          .slice(0, 5);
        dates = open.length
          ? "Currently open to enquire (Brisbane time):\n" +
            open
              .map(
                (slot) =>
                  prettyTime(slot.starts_at) + " — " + prettyTime(slot.ends_at),
              )
              .join("\n")
          : "You can view open dates at " +
            window.location.origin +
            "/availability";
      } catch {
        dates =
          "Share a preferred date and I’ll check the latest availability for you.";
      }
    }
    const total = o.quote_amount ?? (p ? p.price + (o.film ? 100 : 0) : null);
    const text = `Hi ${o.name}, thank you for your enquiry!\n\n${p ? `${p.name}: ${o.quote_amount == null && p.from ? "from " : ""}A$${total}${o.film ? " with one roll of film" : ""}. ${p.details.join(". ")}.\n\n` : ""}${dates}\n\n${o.status === "confirmed" ? "Your booking is confirmed. Please contact me if your plans change." : "Please let me know your preferred time and location. I’ll confirm the final quote, schedule and deposit before reserving your session."}\n\nHannah · ${studio.name}`;
    try {
      await navigator.clipboard.writeText(text);
      setNotice("Reply copied. Review the dates and quote before sending.");
    } catch {
      setNotice(text);
    }
  }
  if (auth === null) return <p>Checking your studio access…</p>;
  if (!auth)
    return (
      <div className="manager-login">
        <h2>Welcome back, Hannah.</h2>
        <p>Sign in to manage enquiries, bookings and availability.</p>
        {!configured && (
          <p className="notice">
            The studio sign-in needs its private password and session secret
            configured on the server.
          </p>
        )}
        <form className="inquiry-form" onSubmit={login}>
          <div className="full">
            <label htmlFor="password">Studio password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              autoComplete="current-password"
              maxLength={256}
            />
          </div>
          <button className="button full" disabled={busy || !configured}>
            {busy ? "Signing in…" : "Open the studio ↗"}
          </button>
        </form>
        {error && (
          <p className="notice error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  const visible = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      [o.name, o.email, o.wechat, o.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="manager-toolbar">
        <div className="chip-row">
          <button
            className={"chip " + (tab === "orders" ? "active" : "")}
            onClick={() => setTab("orders")}
          >
            Enquiries & orders
          </button>
          <button
            className={"chip " + (tab === "calendar" ? "active" : "")}
            onClick={() => setTab("calendar")}
          >
            Availability
          </button>
        </div>
        <div>
          <button className="chip" onClick={refresh} disabled={loading}>
            Refresh
          </button>
          <button className="chip" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="notice" role="status" style={{ whiteSpace: "pre-wrap" }}>
          {notice}
        </p>
      )}
      {loading && <p role="status">Updating your studio…</p>}
      {tab === "orders" ? (
        <>
          <div className="manager-stats">
            <div>
              <strong>{orders.filter((o) => o.status === "new").length}</strong>
              <span>New enquiries</span>
            </div>
            <div>
              <strong>
                {orders.filter((o) => o.status === "confirmed").length}
              </strong>
              <span>Confirmed sessions</span>
            </div>
            <div>
              <strong>
                {orders.filter((o) => o.email_status !== "sent").length}
              </strong>
              <span>Notifications to review</span>
            </div>
          </div>
          <div className="manager-filters">
            <label>
              Find an enquiry
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email, WeChat or reference"
              />
            </label>
            <label>
              Status
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="muted">
            Showing the latest {orders.length} enquiries (up to 500). Payment
            amounts are recorded manually; no payments are processed here.
          </p>
          {!loading && !visible.length && (
            <p className="notice">No enquiries match this view.</p>
          )}
          <div className="order-list">
            {visible.map((o) => (
              <article className="order-card" key={o.id}>
                <div>
                  <p className="eyebrow">
                    {o.id.slice(0, 8).toUpperCase()} · {o.source} · {o.status}
                  </p>
                  <h3>{o.name}</h3>
                  <p>
                    {o.session_type} · {o.style || "Style to discuss"}
                    {o.film ? " · 35mm film" : ""}
                  </p>
                  <p className="muted">
                    {o.starts_at
                      ? prettyTime(o.starts_at)
                      : o.preferred_dates || "Date to discuss"}
                    <br />
                    {o.location || "Location to discuss"}
                  </p>
                  {o.email && (
                    <a className="text-link" href={"mailto:" + o.email}>
                      {o.email}
                    </a>
                  )}
                  {o.wechat && <p>WeChat: {o.wechat}</p>}
                  <p className="muted">
                    Quote:{" "}
                    {o.quote_amount == null ? "Not set" : "A$" + o.quote_amount}{" "}
                    · Deposit recorded: A${o.deposit_paid || 0}
                  </p>
                </div>
                <div className="order-actions">
                  <button className="button" onClick={() => setSelected(o)}>
                    Manage order ↗
                  </button>
                  <button className="chip" onClick={() => copyReply(o)}>
                    Copy a reply
                  </button>
                  <span className="muted">Email: {o.email_status}</span>
                  {o.email_status !== "sent" && (
                    <button
                      disabled={busy}
                      className="chip"
                      onClick={() => retryEmail(o.id)}
                    >
                      Retry studio notification
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="two-column">
            <div>
              <h2>Open your calendar.</h2>
              <p>
                Publish the time windows clients can enquire about. All entries
                use Brisbane time, AEST (UTC+10). Include makeup and travel when
                blocking time for a confirmed order.
              </p>
              <p>
                Confirmed, editing and completed orders automatically hide
                overlapping public time windows. Closing a published window does
                not cancel an existing booking.
              </p>
            </div>
            <form className="inquiry-form" onSubmit={publishSlot}>
              <div className="full">
                <label htmlFor="slot-start">Start (Brisbane time)</label>
                <input
                  id="slot-start"
                  type="datetime-local"
                  name="start"
                  required
                />
              </div>
              <div className="full">
                <label htmlFor="slot-end">End (Brisbane time)</label>
                <input
                  id="slot-end"
                  type="datetime-local"
                  name="end"
                  required
                />
              </div>
              <button disabled={busy} className="button full">
                Publish time window ↗
              </button>
            </form>
          </div>
          <PublishSchedule onPublished={refresh} />
          <CalendarImport />
          <div className="order-list">
            {slots.map((s) => (
              <div key={s.id} className="order-card">
                <p>
                  {prettyTime(s.starts_at)} — {prettyTime(s.ends_at)}
                  <br />
                  <small>
                    {s.status === "available"
                      ? "Published, unless blocked by an order or your work calendar"
                      : "Closed to enquiries"}
                  </small>
                </p>
                <button
                  className="chip"
                  disabled={busy}
                  onClick={() => toggleSlot(s)}
                >
                  {s.status === "available"
                    ? "Close this window"
                    : "Reopen this window"}
                </button>
              </div>
            ))}
          </div>
          {!slots.length && !loading && (
            <p className="notice">
              No future time windows have been published yet.
            </p>
          )}
        </>
      )}
      {selected && (
        <dialog
          ref={editor}
          className="order-editor"
          aria-labelledby="order-title"
          onCancel={() => setSelected(null)}
        >
          <div className="manager-toolbar">
            <h2 id="order-title">{selected.name}</h2>
            <button className="chip" onClick={() => setSelected(null)}>
              Close editor ×
            </button>
          </div>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {selected.message || "No additional message."}
          </p>
          <p>
            {selected.phone ? "Phone: " + selected.phone : ""} · Preferred
            contact: {selected.contact_method}
          </p>
          {error && (
            <p className="notice error" role="alert">
              {error}
            </p>
          )}
          <form className="inquiry-form" onSubmit={saveOrder}>
            <div>
              <label htmlFor="order-status">Status</label>
              <select
                id="order-status"
                name="status"
                defaultValue={selected.status}
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="order-quote">Final quote (AUD)</label>
              <input
                id="order-quote"
                name="quote"
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                defaultValue={selected.quote_amount ?? ""}
              />
            </div>
            <div>
              <label htmlFor="order-start">Session start (Brisbane)</label>
              <input
                id="order-start"
                name="start"
                type="datetime-local"
                defaultValue={localTime(selected.starts_at)}
              />
            </div>
            <div>
              <label htmlFor="order-end">Session end (Brisbane)</label>
              <input
                id="order-end"
                name="end"
                type="datetime-local"
                defaultValue={localTime(selected.ends_at)}
              />
            </div>
            <div>
              <label htmlFor="order-deposit">Deposit received (AUD)</label>
              <input
                id="order-deposit"
                name="deposit"
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                defaultValue={selected.deposit_paid || 0}
              />
            </div>
            <div className="full">
              <label htmlFor="order-notes">Private studio notes</label>
              <textarea
                id="order-notes"
                name="notes"
                maxLength={4000}
                rows={4}
                defaultValue={selected.private_notes || ""}
              />
            </div>
            <p className="muted full">
              Confirm the schedule and quote with the client before changing
              status. Saving does not message the client. Use the complete
              occupied time, including makeup and travel, to prevent overlapping
              sessions.
            </p>
            <button className="button full" disabled={busy}>
              {busy ? "Saving…" : "Save order"}
            </button>
          </form>
        </dialog>
      )}
    </>
  );
}
