"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import "./studio-hero.css";

const chapters = [
  ["01", "Weddings", "weddings"],
  ["02", "Graduation", "graduation"],
  ["03", "Registry", "registry"],
  ["04", "Portraits", "portraits"],
];

export default function StudioHero() {
  const focus = useRef<HTMLDivElement>(null);
  function track(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !focus.current) return;
    const target = event.target as HTMLElement;
    const interactive = target.closest("a, button");
    const bounds = event.currentTarget.getBoundingClientRect();
    focus.current.style.transform = `translate3d(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px, 0)`;
    focus.current.dataset.visible = interactive ? "false" : "true";
  }
  function leave() {
    if (focus.current) focus.current.dataset.visible = "false";
  }
  return (
    <section className="studio-hero" aria-labelledby="studio-hero-title" onPointerMove={track} onPointerLeave={leave}>
      <div className="studio-hero-photograph">
        <Image src="/images/stories/garden-reflections.webp" alt="A bride and groom holding hands beside a reflecting pool in a palm-lined garden" fill priority sizes="100vw" />
      </div>
      <div className="studio-hero-shade" />
      <div className="studio-hero-copy">
        <p className="eyebrow">SEPHANNAH STUDIO · BRISBANE & BEYOND</p>
        <h1 id="studio-hero-title">A day lived.<br /><em>A feeling kept.</em></h1>
        <p className="studio-hero-description">Wedding days. New chapters. The people you love.<br />Photography with feeling, in digital & 35mm film.</p>
        <div className="studio-hero-actions">
          <Link className="button" href="/collections">Explore the photographs <span aria-hidden="true">↗</span></Link>
          <Link className="studio-hero-enquire" href="#enquire">Let’s talk about your day <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <nav className="glass-collections" aria-label="Explore photography collections">
        {chapters.map(([number, label, slug]) => <Link key={slug} href={`/collections/${slug}`}><span>{number}</span><strong>{label}</strong><span aria-hidden="true">↗</span></Link>)}
      </nav>
      <div ref={focus} className="camera-focus" data-visible="false" aria-hidden="true"><span /><small>IN THE MOMENT</small></div>
    </section>
  );
}
