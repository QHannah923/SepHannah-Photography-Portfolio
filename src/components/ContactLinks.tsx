"use client";

import { useState } from "react";
import { studio } from "@/lib/studio";

export default function ContactLinks() {
  const [message, setMessage] = useState("");
  async function copyWeChat() {
    try {
      await navigator.clipboard.writeText(studio.wechat);
      setMessage("WeChat ID copied. Search for SepHannah in WeChat.");
    } catch {
      setMessage("Search for SepHannah in WeChat to get in touch.");
    }
  }
  return (
    <div className="contact-options">
      <a href={studio.instagram} target="_blank" rel="noopener noreferrer">
        <span>INSTAGRAM <span aria-hidden="true">↗</span></span>
        <strong>{studio.instagramHandle}</strong>
        <small>See recent stories & send a message</small>
      </a>
      <button type="button" onClick={copyWeChat}>
        <span>WECHAT <span aria-hidden="true">＋</span></span>
        <strong>{studio.wechat}</strong>
        <small>Copy my ID · English & Mandarin welcome</small>
      </button>
      <a href={"mailto:" + studio.email}>
        <span>EMAIL <span aria-hidden="true">↗</span></span>
        <strong>{studio.email}</strong>
        <small>Your date, your ideas, a little about you</small>
      </a>
      <p className="contact-status" role="status">{message}</p>
    </div>
  );
}
