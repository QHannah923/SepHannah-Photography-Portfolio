"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { packages } from "@/lib/studio";
export default function PackageSelector() {
  const [group, setGroup] = useState("graduation");
  const [film, setFilm] = useState(false);
  useEffect(() => {
    setFilm(new URLSearchParams(window.location.search).get("film") === "1");
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (["graduation", "portrait", "registry", "wedding"].includes(hash))
        setGroup(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return (
    <>
      <div className="chip-row" aria-label="Select session category">
        {[
          ["graduation", "Graduation"],
          ["portrait", "Portraits"],
          ["registry", "Registry ceremonies"],
          ["wedding", "Weddings"],
        ].map(([id, name]) => (
          <button
            id={id}
            key={id}
            aria-pressed={group === id}
            className={"chip " + (group === id ? "active" : "")}
            onClick={() => setGroup(id)}
          >
            {name}
          </button>
        ))}
      </div>
      <label className="film-toggle">
        <input
          type="checkbox"
          checked={film}
          onChange={(e) => setFilm(e.target.checked)}
        />
        <span>
          Add a roll of real 35mm film{" "}
          <small>+ A$100 · processing included</small>
        </span>
      </label>
      <div className="cards package-cards" key={group + "-" + film}>
        {packages
          .filter((p) => p.group === group)
          .map((p) => (
            <article className="info-card" key={p.id}>
              <p className="eyebrow">
                {p.group.toUpperCase()}
                {film ? " + 35MM FILM" : ""}
              </p>
              <h3>{p.name}</h3>
              <p className="price">
                {p.from ? "From " : ""}A$
                {(p.price + (film ? 100 : 0)).toLocaleString()}
              </p>
              <ul>
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
                {film && <li>One roll of 35mm film with processing</li>}
              </ul>
              <Link
                className="button"
                href={"/inquire?package=" + p.id + (film ? "&film=1" : "")}
              >
                Choose this session ↗
              </Link>
            </article>
          ))}
      </div>
      <p className="muted">
        All prices are in Australian dollars. The studio will confirm travel,
        optional extras and the final quote before your booking.
      </p>
    </>
  );
}
