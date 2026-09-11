import Link from "next/link";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import Gallery from "@/components/Gallery";
import { collections, photos, pageMetadata, siteUrl } from "@/lib/studio";
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((c) => c.slug === slug);
  return c
    ? pageMetadata(
        c.name + " Photography Brisbane",
        c.description,
        "/collections/" + c.slug,
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((c) => c.slug === slug);
  if (!c) notFound();
  return (
    <main id="main">
      <PageIntro
        label={"BRISBANE / " + c.name.toUpperCase()}
        title={c.headline}
      >
        {c.description}
      </PageIntro>
      <div className="page-content">
        <nav className="inline-links" aria-label="Photography collections">
          {collections.map((x) => (
            <Link
              className="text-link"
              href={"/collections/" + x.slug}
              key={x.slug}
            >
              {x.name}
            </Link>
          ))}
        </nav>
        <Gallery photos={photos.filter((p) => p.collection === c.slug)} />
        <section className="guide-section prose">
          <h2>Your session, thoughtfully planned.</h2>
          <p>{c.guide}</p>
          <div className="inline-links">
            <Link className="button" href={"/inquire?session=" + c.session}>
              Plan this session ↗
            </Link>
            <Link className="text-link" href={"/pricing#" + c.session}>
              View the packages ↗
            </Link>
          </div>
        </section>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: c.name + " photography",
            description: c.description,
            areaServed: "Brisbane",
            url: siteUrl + "/collections/" + c.slug,
            provider: {
              "@type": "ProfessionalService",
              name: "SepHannah Studio",
              url: siteUrl,
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
