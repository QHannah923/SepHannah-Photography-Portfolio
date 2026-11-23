import Image from "next/image";
import type { ReactNode } from "react";

export default function EditorialFeature({ image, alt, eyebrow, title, children }: { image: string; alt: string; eyebrow: string; title: string; children: ReactNode }) {
  return <section className="editorial-feature"><div className="editorial-feature-image"><Image src={image} alt={alt} fill sizes="(max-width: 760px) 90vw, 45vw" /></div><div className="editorial-feature-copy"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</div></section>;
}
