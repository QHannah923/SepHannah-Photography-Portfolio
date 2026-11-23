"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { packages, studio, styles } from "@/lib/studio";

export default function QuickInquiryForm() {
  const query = useSearchParams();
  const [slot, setSlot] = useState(query.get("slot") || "");
  const [contactMethod, setContactMethod] = useState("email");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState("");
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(`mailto:${studio.email}`);
  const requestId = useRef("");
  const selected = packages.find((p) => p.id === query.get("package"));
  const session = selected?.group || (["wedding", "graduation", "registry", "portrait"].includes(query.get("session") || "") ? query.get("session")! : "other");
  const selectedStyle = styles.find((s) => s.id === query.get("style"));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contactDetails") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !contact || !message) {
      setError("Please add your name, contact details and a little about your plans.");
      setStatus("error");
      return;
    }
    setFallback(`mailto:${studio.email}?subject=${encodeURIComponent("Photography enquiry from " + name)}&body=${encodeURIComponent(`Name: ${name}\nReply by ${contactMethod}: ${contact}\n\n${message}`)}`);
    setStatus("sending");
    setError("");
    if (!requestId.current) requestId.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, message, contactMethod,
          email: contactMethod === "email" ? contact : "",
          wechat: contactMethod === "wechat" ? contact : "",
          sessionType: session,
          packageId: selected?.id || "",
          style: selectedStyle?.id || "",
          preferredDates: query.get("date") || "",
          slotId: slot,
          film: query.get("film") === "1",
          website: data.get("website"),
          consent: true,
          requestId: requestId.current,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) setSlot("");
        throw new Error(result.error || "Your enquiry could not be saved. Please try again.");
      }
      setTracking(result.trackingToken || "");
      setStatus("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t connect. Please try again or email Hannah below.");
      setStatus("error");
    }
  }
  if (status === "success") return <div className="quick-success" role="status">
    <p className="eyebrow">THANK YOU FOR SAYING HELLO</p><h3>Your enquiry is saved.</h3>
    <p>Hannah will be in touch using your preferred contact details to plan a session around you. Your date is confirmed separately.</p>
    {tracking && <><button type="button" className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(tracking); setCopied(true); } catch { setError("Your private tracking code: " + tracking); } }}>{copied ? "Tracking code copied" : "Copy your private tracking code"}</button><p><Link className="text-link" href="/booking-status">View your enquiry’s progress ↗</Link></p></>}
    {error && <p className="tracking-code">{error}</p>}
  </div>;

  return <form className="quick-inquiry" onSubmit={submit}>
    <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    {selected && <p className="quick-context">Your starting point: {selected.name}. We’ll confirm the details together.</p>}
    {query.get("date") && <p className="quick-context">Preferred date: {query.get("date")}</p>}
    <div><label htmlFor="quick-name">Your name</label><input id="quick-name" name="name" required maxLength={100} autoComplete="name" placeholder="What should I call you?" /></div>
    <div><div className="quick-contact-label"><label htmlFor="quick-contact">Your contact details</label><select aria-label="Preferred contact method" value={contactMethod} onChange={(event) => setContactMethod(event.target.value)}><option value="email">Email</option><option value="wechat">WeChat</option></select></div><input key={contactMethod} id="quick-contact" name="contactDetails" type={contactMethod === "email" ? "email" : "text"} required maxLength={contactMethod === "email" ? 254 : 100} autoComplete={contactMethod === "email" ? "email" : "off"} placeholder={contactMethod === "email" ? "Your email address" : "Your WeChat ID"} /></div>
    <div className="quick-message"><label htmlFor="quick-message">What would you love to photograph?</label><textarea id="quick-message" name="message" required maxLength={4000} rows={5} defaultValue={query.get("interest") === "makeup" ? "I’d love to discuss photography and makeup. " : query.get("interest") === "scene-styling" ? "I’d love help with locations and styling. " : ""} placeholder="Tell us what you’d like to capture and the style you love — soft and natural, nostalgic film, editorial, or something entirely your own. We’ll help customise the experience around you." /><p className="quick-help">No need to have it all worked out. A little inspiration is enough to begin.</p></div>
    <p className="quick-privacy">By sending, you agree that Hannah can use these details to reply to your enquiry. <Link href="/privacy">Privacy notice</Link>.</p>
    {status === "error" && <div className="quick-error" role="alert"><p>{error}</p><a className="text-link" href={fallback}>Email your enquiry to Hannah ↗</a></div>}
    <button className="button" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending your enquiry…" : "Let’s create something personal ↗"}</button>
    <p className="quick-help">No payment or commitment. Just the start of a conversation.</p>
  </form>;
}
