import Link from "next/link";
import Image from "next/image";
import PageIntro from "@/components/PageIntro";
import Gallery from "@/components/Gallery";
import { collections, photos, pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Photography Collections in Brisbane",
  "Explore wedding, graduation, registry ceremony and portrait photography by Brisbane photographer Hannah.",
  "/collections",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro label="THE COLLECTIONS" title="Every chapter, remembered.">
        Weddings, graduations, intimate ceremonies and portraits. Find the
        photographs that speak to your next chapter.
      </PageIntro>
      <div className="page-content">
        <div className="collection-grid">
          {collections.map((c) => (
            <Link
              href={"/collections/" + c.slug}
              key={c.slug}
              className="collection-card"
            >
              <div className="collection-image">
                <Image
                  src={c.slug === "weddings" ? "/images/stories/just-married.webp" : c.slug === "registry" ? "/images/stories/city-walk.webp" : "/images/" + c.image + ".jpg"}
                  alt={c.name + " by SepHannah Studio"}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className="card-label">
                <h3>{c.name}</h3>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
        <section className="portfolio-selection">
          <div className="section-heading"><div><p className="eyebrow">THE PHOTOGRAPHS</p><h2>Days lived.<br /><em>Feelings kept.</em></h2></div><p>Explore the full selection, choose a visual style, or open a photograph to see the details. Every photograph here is from Hannah’s own work.</p></div>
          <Gallery photos={photos} />
        </section>
        <div className="inline-links">
          <Link className="text-link" href="/styles">
            Explore by photographic style ↗
          </Link>
          <Link className="text-link" href="/pricing">
            View packages ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
