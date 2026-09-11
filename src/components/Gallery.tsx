"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Photo, styles } from "@/lib/studio";
export default function Gallery({
  photos,
  initialStyle = "all",
}: {
  photos: Photo[];
  initialStyle?: string;
}) {
  const [style, setStyle] = useState(initialStyle);
  const [active, setActive] = useState<Photo | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible =
    style === "all" ? photos : photos.filter((p) => p.styles.includes(style));
  useEffect(() => {
    if (active) {
      dialog.current?.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
      };
    } else dialog.current?.close();
  }, [active]);
  function move(n: number) {
    if (!active) return;
    const i = visible.findIndex((p) => p.id === active.id);
    setActive(visible[(i + n + visible.length) % visible.length]);
  }
  return (
    <>
      <div className="chip-row" aria-label="Filter by photographic style">
        {[{ id: "all", name: "All styles" }, ...styles].map((s) => (
          <button
            key={s.id}
            className={"chip " + (style === s.id ? "active" : "")}
            aria-pressed={style === s.id}
            onClick={() => setStyle(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <p className="muted" aria-live="polite">
        {visible.length} photographs · Select a photograph to look closer
      </p>
      <div className="gallery" key={style}>
        {visible.map((p) => (
          <figure key={p.id}>
            <button
              className="gallery-image"
              onClick={() => setActive(p)}
              aria-label={"Enlarge: " + p.alt}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 760px) 50vw, 30vw"
              />
              <span className="image-open">View photograph ↗</span>
            </button>
            <figcaption>{p.alt}</figcaption>
          </figure>
        ))}
      </div>
      {!visible.length && (
        <div className="notice">
          This collection does not have a published example in this style yet.
          Choose another style or ask Hannah for more photographs.
        </div>
      )}
      {style !== "all" && (
        <div className="inline-links">
          <Link className="button" href={"/inquire?style=" + style}>
            Plan a session in this style ↗
          </Link>
        </div>
      )}
      <dialog
        ref={dialog}
        className="lightbox"
        onCancel={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") move(-1);
          if (e.key === "ArrowRight") move(1);
        }}
        aria-label="Photograph viewer"
      >
        {active && (
          <>
            <button
              className="lightbox-close"
              onClick={() => setActive(null)}
              autoFocus
            >
              Close ×
            </button>
            <div className="lightbox-image">
              <Image src={active.src} alt={active.alt} fill sizes="90vw" />
            </div>
            <div className="lightbox-controls">
              <button onClick={() => move(-1)} aria-label="Previous photograph">
                ←
              </button>
              <p>{active.alt}</p>
              <button onClick={() => move(1)} aria-label="Next photograph">
                →
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
