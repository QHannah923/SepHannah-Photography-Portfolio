"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { packages, styles } from "@/lib/studio";
export default function InquiryForm({
  submitLabel = "Send my enquiry",
  ownerEmail = "qhanna000@gmail.com",
}: {
  submitLabel?: string;
  ownerEmail?: string;
}) {
  const query = useSearchParams();
  const selected = packages.find((p) => p.id === query.get("package"));
  const [session, setSession] = useState(
    selected?.group ||
      (["wedding", "graduation", "registry", "portrait"].includes(
        query.get("session") || "",
      )
        ? query.get("session")!
        : "wedding"),
  );
  const [packageId, setPackageId] = useState(selected?.id || "");
  const [contact, setContact] = useState("email");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [tracking, setTracking] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);
  const requestId = useRef("");
  const [slot, setSlot] = useState(query.get("slot") || "");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const form = e.currentTarget,
      fd = new FormData(form);
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email") || "",
          wechat: fd.get("wechat") || "",
          phone: fd.get("phone"),
          sessionType: session,
          packageId,
          contactMethod: contact,
          preferredDates: fd.get("preferredDates"),
          slotId: slot,
          style: fd.get("style"),
          film: fd.get("film") === "on",
          location: fd.get("location"),
          message: fd.get("message"),
          website: fd.get("website"),
          consent: fd.get("consent") === "on",
          requestId: requestId.current,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (r.status === 409) setSlot("");
        throw new Error(d.error || "Could not send your enquiry");
      }
      setMessage("");
      setReference(d.reference || "");
      setTracking(d.trackingToken || "");
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setMessage(
        e instanceof Error
          ? e.message
          : "Could not connect. Please email the studio.",
      );
    }
  }
  if (status === "success")
    return (
      <div className="success" role="status">
        <p className="eyebrow">YOUR STORY STARTS HERE</p>
        <h3>Thank you. Your enquiry is saved.</h3>
        <p>
          Hannah will review your plans and get in touch. Your date is not yet
          reserved.
        </p>
        {reference && (
          <p className="muted">
            Reference: {reference.slice(0, 8).toUpperCase()}
          </p>
        )}
        {tracking && (
          <>
            <button
              className="chip"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(tracking);
                  setTokenCopied(true);
                } catch {
                  setMessage(
                    "Please copy your private code manually: " + tracking,
                  );
                }
              }}
            >
              {tokenCopied
                ? "Private tracking code copied"
                : "Copy my private tracking code"}
            </button>
            <p className="muted">
              Keep this private code to check your enquiry in My requests.
            </p>
            <Link className="text-link" href="/booking-status">
              Check my request ↗
            </Link>
          </>
        )}
        {message && <p>{message}</p>}
        <p>
          You can also contact{" "}
          <a className="text-link" href={"mailto:" + ownerEmail}>
            {ownerEmail}
          </a>
          .
        </p>
      </div>
    );
  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div style={{ display: "none" }} aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="name">Your name *</label>
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor="contact">How should Hannah reply?</label>
        <select
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        >
          <option value="email">Email</option>
          <option value="wechat">WeChat</option>
        </select>
      </div>
      <div>
        <label htmlFor="email">
          Email {contact === "email" ? "*" : "(optional)"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required={contact === "email"}
          maxLength={254}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="wechat">
          WeChat ID {contact === "wechat" ? "*" : "(optional)"}
        </label>
        <input
          id="wechat"
          name="wechat"
          required={contact === "wechat"}
          maxLength={100}
        />
      </div>
      <div>
        <label htmlFor="phone">Phone (optional)</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
        />
      </div>
      <div>
        <label htmlFor="sessionType">Your occasion</label>
        <select
          id="sessionType"
          value={session}
          onChange={(e) => {
            setSession(e.target.value);
            setPackageId("");
          }}
        >
          {[
            ["wedding", "Wedding / pre-wedding"],
            ["graduation", "Graduation"],
            ["registry", "Registry ceremony"],
            ["portrait", "Portrait"],
            ["other", "Something else"],
          ].map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="full">
        <label htmlFor="package">Your package</label>
        <select
          id="package"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
        >
          <option value="">I’d like your advice</option>
          {packages
            .filter((p) => p.group === session)
            .map((p) => (
              <option value={p.id} key={p.id}>
                {p.name} · {p.from ? "from " : ""}A${p.price}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="style">The feeling you love</label>
        <select
          id="style"
          name="style"
          defaultValue={
            styles.some((s) => s.id === query.get("style"))
              ? query.get("style")!
              : ""
          }
        >
          <option value="">Let’s decide together</option>
          {styles.map((s) => (
            <option value={s.id} key={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="location">Location (optional)</label>
        <input
          name="location"
          id="location"
          maxLength={250}
          placeholder="Brisbane, your venue, or somewhere else"
        />
      </div>
      <div className="full">
        <label htmlFor="preferredDates">Preferred date or dates</label>
        <input
          id="preferredDates"
          name="preferredDates"
          maxLength={500}
          defaultValue={query.get("date") || ""}
          readOnly={!!slot}
          placeholder="Your preferred dates, or let us know you’re flexible"
        />
        <div className="inline-links">
          <Link className="text-link" href="/availability">
            Explore available times ↗
          </Link>
          {slot && (
            <button
              type="button"
              className="text-link"
              onClick={() => setSlot("")}
            >
              Remove selected time
            </button>
          )}
        </div>
      </div>
      <label className="check-label full">
        <input
          name="film"
          type="checkbox"
          defaultChecked={query.get("film") === "1"}
        />
        <span>Add real 35mm film · A$100 per roll, including processing</span>
      </label>
      <div className="full">
        <label htmlFor="message">Tell me a little about your plans</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={4000}
          defaultValue={
            query.get("interest") === "makeup"
              ? "I would love to discuss makeup and styling."
              : query.get("interest") === "scene-styling"
                ? "I would love help with locations, props and scene styling."
                : ""
          }
          placeholder="Your story, styling ideas, favourite places or anything you’d like me to know."
        />
      </div>
      <label className="check-label full">
        <input name="consent" type="checkbox" required />
        <span>
          I agree that my details can be used to respond to this enquiry and
          manage my booking.{" "}
          <Link className="text-link" href="/privacy">
            Privacy notice
          </Link>
        </span>
      </label>
      {status === "error" && (
        <div role="alert" className="notice error full">
          {message}
          <p>
            <a href={"mailto:" + ownerEmail} className="text-link">
              Email Hannah directly ↗
            </a>
          </p>
        </div>
      )}
      <button
        className="button full"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending your story…" : submitLabel + " ↗"}
      </button>
      <p className="muted full">
        This is an enquiry, not a confirmed booking. No payment is taken here.
      </p>
    </form>
  );
}
