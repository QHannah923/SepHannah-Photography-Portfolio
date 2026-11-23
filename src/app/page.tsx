import Image from "next/image";
import { StorySection, CollectionFeature, ClientWords, HomeFAQ, HomeContact } from "@/components/HomeEditorial";
import StudioHero from "@/components/StudioHero";
import Link from "next/link";
import { pageMetadata, siteUrl, studio } from "@/lib/studio";
export const metadata = pageMetadata(
  "Brisbane Wedding & Portrait Photographer",
  "Brisbane wedding, graduation, registry and portrait photography. Explore SepHannah Studio’s collections, digital and film packages, and available dates.",
  "/",
);
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: studio.name,
  url: siteUrl,
  email: studio.email,
  sameAs: [studio.instagram],
  description:
    "Wedding, graduation, registry and portrait photography based in Brisbane.",
  areaServed: { "@type": "City", name: "Brisbane" },
  image: siteUrl + "/images/stories/just-married.webp",
};
export default function HomePage() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StudioHero />
      <div className="intro-strip">
        <span>BRISBANE, AUSTRALIA</span>
        <span>Digital &amp; 35mm film</span>
        <span>Available to travel</span>
      </div>
      <section id="home-collections" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTIONS</p>
            <h2>
              Life happens.
              <br />
              <em>Keep the feeling.</em>
            </h2>
          </div>
          <p>
            Find your kind of moment. Each collection is a different chapter,
            photographed with the same thoughtful eye.
          </p>
        </div>
        <div className="collection-grid">
          {[
            ["weddings", "Wedding stories", "wedding2", "01"],
            ["graduation", "A new chapter", "graduation", "02"],
            ["registry", "Just married", "ceremony1", "03"],
          ].map(([slug, title, photo, num]) => (
            <Link
              className="collection-card"
              href={"/collections/" + slug}
              key={slug}
            >
              <div className="collection-image">
                <Image
                  src={"/images/" + photo + ".jpg"}
                  alt={title + " photography by SepHannah Studio"}
                  fill
                  sizes="(max-width: 760px) 100vw, 33vw"
                />
              </div>
              <div className="card-label">
                <span>
                  <small>
                    {num} /{" "}
                    {slug === "registry"
                      ? "REGISTRY CEREMONIES"
                      : slug.toUpperCase()}
                  </small>
                  <h3>{title}</h3>
                </span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="inline-links">
          <Link className="text-link" href="/collections/portraits">
            Explore portraits ↗
          </Link>
          <Link className="text-link" href="/styles">
            Find your photography style ↗
          </Link>
        </div>
      </section>
      <StorySection />
      <section className="studio-band">
        <div>
          <p className="eyebrow">
            BE YOURSELF. I’LL TAKE CARE OF THE PHOTOGRAPHS.
          </p>
          <h2>
            Less posing.
            <br />
            <em>More being there.</em>
          </h2>
        </div>
        <div>
          <p>
            I’m Hannah, the photographer behind SepHannah Studio in Brisbane.
            I’m drawn to real people, beautiful light, and the in-between
            moments that make a day yours.
          </p>
          <p>
            Whether you’re getting married, graduating, or simply making time
            for yourself, let’s create photographs that feel personal.
          </p>
          <Link className="text-link" href="/about">
            Meet your photographer ↗
          </Link>
        </div>
      </section>
      <CollectionFeature />
      <section className="home-film">
        <div className="home-film-image">
          <Image
            src="/images/wedding.jpg"
            alt="A couple celebrating their wedding at sunset"
            fill
            sizes="(max-width: 760px) 100vw, 45vw"
          />
        </div>
        <div className="home-film-copy">
          <p className="eyebrow">DIGITAL + 35MM</p>
          <h2>
            A little clarity.
            <br />
            <em>A little nostalgia.</em>
          </h2>
          <p>
            Keep the fleeting details in digital, and leave a little room for
            the unexpected with real film. Two different ways of remembering the
            same beautiful day.
          </p>
          <p className="home-film-price">
            Your session. Plus one roll.
            <span>35mm film · A$100, processing included</span>
          </p>
          <Link className="text-link" href="/pricing?film=1#wedding">
            Explore digital + film ↗
          </Link>
        </div>
      </section>
      <section className="section home-process">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              FROM A FIRST HELLO TO YOUR FAVOURITE PHOTOGRAPHS
            </p>
            <h2>
              Made personal.
              <br />
              <em>Kept simple.</em>
            </h2>
          </div>
        </div>
        <div className="home-process-grid">
          {[
            [
              "01",
              "Find your feeling.",
              "Explore the collections and choose the visual style that feels like you.",
              "/styles",
              "Discover your style",
            ],
            [
              "02",
              "Make a little plan.",
              "Choose a package, share your preferred date and tell me what you have in mind.",
              "/availability",
              "Find your date",
            ],
            [
              "03",
              "Be there, together.",
              "I’ll confirm the details, help with styling and guide you gently through your session.",
              "/makeup",
              "Explore the finishing touches",
            ],
          ].map(([n, title, copy, href, label]) => (
            <article key={n}>
              <span className="eyebrow">{n}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <Link className="text-link" href={href}>
                {label} ↗
              </Link>
            </article>
          ))}
        </div>
      </section>
      <ClientWords />
      <HomeFAQ />
      <HomeContact />
    </main>
  );
}
