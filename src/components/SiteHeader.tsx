"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header
      className={"site-header" + (path === "/" ? " site-header-immersive" : "")}
    >
      <Link href="/" className="wordmark" onClick={() => setOpen(false)}>
        SepHannah<span>PHOTOGRAPHY STUDIO</span>
      </Link>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="navigation"
        className={open ? "navigation open" : "navigation"}
        aria-label="Main navigation"
      >
        {[
          ["Collections", "/collections"],
          ["The studio", "/about"],
          ["Pricing & dates", "/pricing"],
          ["Makeup", "/makeup"],
          ["Scene styling", "/scene-styling"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        ))}
        <Link
          className="button small"
          href="/inquire"
          onClick={() => setOpen(false)}
        >
          Let’s make memories ↗
        </Link>
      </nav>
    </header>
  );
}
