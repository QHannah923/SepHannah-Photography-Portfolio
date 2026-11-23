import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import PackageSelector from "@/components/PackageSelector";
import EditorialFeature from "@/components/EditorialFeature";
import { faqs, pageMetadata, packages, siteUrl } from "@/lib/studio";
export const metadata = pageMetadata(
  "Photography Prices & Packages Brisbane",
  "Graduation from A$309, portraits from A$399, registry sessions A$569, and wedding photography from A$300 per hour. Explore packages and dates.",
  "/pricing",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro
        label="THE EXPERIENCE / PRICING & DATES"
        title="Make room for the memories."
      >
        Thoughtful sessions, clear prices, photographs to come back to. Choose a
        starting point and we’ll plan the details together.
      </PageIntro>
      <div className="page-content">
        <EditorialFeature image="/images/stories/garden-reflections.webp" alt="A bride and groom walking beside a reflecting pool in a tropical garden" eyebrow="THE INVESTMENT" title="Photographs to come back to."><p>Choose a starting point below, then tell me what matters to you. We’ll shape the time, locations and style around your plans, whether it’s a quiet registry ceremony or a day with everyone you love.</p><p>All prices are in Australian dollars. Travel, venue costs and extra styling are confirmed in your quote, so you can decide with the full picture.</p><Link className="text-link" href="/availability">Explore available dates ↗</Link></EditorialFeature>
        <section className="tailored-package">
          <div><p className="eyebrow">AS SEEN IN OUR STUDIO BROCHURE</p><h2>Photography + makeup.<br /><em>Made for you.</em></h2></div>
          <div><p className="price">Tailored packages from A$999</p><p>Tell us your date, location and the look you have in mind. Your personalised quote confirms photography coverage, makeup and all inclusions. The dedicated sessions below offer other ways to plan your photographs.</p><Link className="text-link" href="/inquire?session=wedding">Request your tailored quote ↗</Link></div>
        </section>
        <PackageSelector />
        <section className="film-feature">
          <p className="eyebrow">TWO WAYS TO REMEMBER</p>
          <h2>
            Digital clarity.
            <br />
            <em>35mm feeling.</em>
          </h2>
          <div>
            <p>
              The detail of digital, alongside the beautiful unpredictability of
              real film. Add a roll to your session for a collection with a
              different rhythm.
            </p>
            <p className="price">Digital package + A$100 / roll</p>
            <p className="muted">
              Nikon F100 · Processing included. Film colour, focus and light
              leaks can vary; usable frame counts are not guaranteed.
            </p>
            <Link className="button" href="/inquire?film=1">
              Enquire about digital + film ↗
            </Link>
          </div>
        </section>
        <section className="guide-section">
          <h2>Find a time for your story.</h2>
          <p>
            See the dates Hannah has opened for enquiries. Every date and time
            is shown in Brisbane time.
          </p>
          <Link className="button" href="/availability">
            Explore available dates ↗
          </Link>
        </section>
        <section className="faq">
          <p className="eyebrow">BEFORE YOUR SESSION</p>
          <h2>The little details.</h2>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            name: "SepHannah photography packages",
            itemListElement: packages.map((p) => ({
              "@type": "Offer",
              name: p.name,
              price: p.price,
              priceCurrency: "AUD",
              url: siteUrl + "/inquire?package=" + p.id,
              itemOffered: {
                "@type": "Service",
                name: p.name,
                description: p.details.join(". "),
              },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
