"use client";

import Image from "next/image";
import Link from "next/link";
import "./domino-hero.css";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const panels = [
  {
    slug: "weddings",
    label: "Weddings",
    photo: "wedding2",
    position: "49% 56%",
    mobilePosition: "49% 42%",
    alt: "A bride and groom dancing together in the sunlight",
  },
  {
    slug: "graduation",
    label: "Graduation",
    photo: "graduation",
    position: "54% 58%",
    mobilePosition: "54% 65%",
    alt: "A graduate celebrating beneath sandstone arches",
  },
  {
    slug: "registry",
    label: "Registry",
    photo: "ceremony1",
    position: "55% 64%",
    mobilePosition: "55% 58%",
    alt: "A newly married couple walking hand in hand in Brisbane",
  },
  {
    slug: "portraits",
    label: "Portraits",
    photo: "portrait3",
    position: "38% 48%",
    mobilePosition: "38% 43%",
    alt: "An intimate portrait with windswept hair and warm film-inspired colour",
  },
];

export default function DominoHero() {
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [turned, setTurned] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const interacted = useRef(false);
  const active = hovered ?? focused ?? pinned;

  useEffect(() => {
    // Slow or failed photographs must never block access to the collections.
    const timer = window.setTimeout(() => setReady(true), 2400);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (loaded >= panels.length) setReady(true);
  }, [loaded]);
  useEffect(() => {
    if (!ready) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers: number[] = [];
    const cancel = () => timers.forEach(window.clearTimeout);
    const update = () => {
      cancel();
      if (preference.matches) {
        setTurned(0);
        return;
      }
      panels.forEach((_, i) =>
        timers.push(
          window.setTimeout(
            () => {
              if (!interacted.current) setTurned(i + 1);
            },
            950 + i * 280,
          ),
        ),
      );
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      cancel();
      preference.removeEventListener("change", update);
    };
  }, [ready]);

  function discover(index: number) {
    // The first deliberate interaction takes over immediately from the introduction.
    interacted.current = true;
    setTurned(panels.length);
    setHovered(index);
  }

  return (
    <section className="domino-hero" aria-labelledby="studio-intro-title">
      <h1 id="studio-intro-title" className="visually-hidden">
        SepHannah Studio — Brisbane wedding, graduation, registry and portrait
        photography
      </h1>
      <div className="domino-panels">
        {panels.map((panel, index) => {
          const showingPhoto = index >= turned || active === index;
          return (
            <article
              key={panel.slug}
              className="domino-panel"
              data-photo={showingPhoto}
              style={
                {
                  "--panel-index": index,
                  "--photo-position": panel.position,
                  "--photo-mobile-position": panel.mobilePosition,
                } as CSSProperties
              }
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") discover(index);
              }}
              onPointerLeave={() => setHovered(null)}
              onFocusCapture={() => {
                interacted.current = true;
                setTurned(panels.length);
                setHovered(null);
                setFocused(index);
              }}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setFocused(null);
              }}
            >
              <div className="domino-rotor" aria-hidden="true">
                <div className="domino-face domino-front">
                  <Image
                    src={"/images/" + panel.photo + ".jpg"}
                    alt={panel.alt}
                    fill
                    priority
                    sizes="(max-width: 760px) 100vw, 25vw"
                    onLoad={() => setLoaded((count) => count + 1)}
                    onError={() => setLoaded((count) => count + 1)}
                  />
                </div>
                <div className="domino-face domino-back">
                  <svg
                    className="domino-lettering domino-lettering-desktop"
                    viewBox={`${index * 250} 0 250 220`}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <text
                      x="500"
                      y="158"
                      textAnchor="middle"
                      textLength="920"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      SepHannah
                    </text>
                  </svg>
                  <svg
                    className="domino-lettering domino-lettering-mobile"
                    viewBox="0 0 1000 220"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <text
                      x="500"
                      y="158"
                      textAnchor="middle"
                      textLength="920"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      SepHannah
                    </text>
                  </svg>
                </div>
              </div>
              <button
                type="button"
                className="domino-reveal"
                aria-label={`Reveal ${panel.label.toLowerCase()} photography`}
                aria-pressed={pinned === index}
                onClick={() => {
                  interacted.current = true;
                  setTurned(panels.length);
                  setPinned(pinned === index ? null : index);
                }}
              />
              <Link
                className="domino-collection"
                href={"/collections/" + panel.slug}
              >
                <span className="domino-number">0{index + 1}</span>
                <span>{panel.label}</span>
                <span className="domino-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </article>
          );
        })}
      </div>
      <a
        className="domino-scroll"
        href="#home-collections"
        aria-label="Explore all photography collections"
      >
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
