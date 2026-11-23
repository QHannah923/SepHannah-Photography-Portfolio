import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import EditorialFeature from "@/components/EditorialFeature";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Makeup & Styling for Photography Brisbane",
  "Plan makeup, hair and wardrobe for graduation, portrait and bridal photography. Styling from A$229; bridal styling from A$500.",
  "/makeup",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro
        label="THE FINISHING TOUCHES"
        title="Feel like yourself. Beautifully."
      >
        Makeup, hair and wardrobe suggestions to bring your photography style
        together.
      </PageIntro>
      <div className="page-content">
        <EditorialFeature image="/images/stories/bridal-preparations.webp" alt="A bride smiling during makeup preparations in front of a lit mirror" eyebrow="BEAUTY, ON YOUR TERMS" title="A look that belongs to you.">
          <p>Your skin, your features and the way you want to feel are our starting point. Our collaborating makeup artist helps shape a look around you, from fresh and understated to something more defined.</p>
          <p>Share your outfit, a few references and your photography style. We’ll bring the makeup, hair and photographs into one considered plan.</p>
          <ol className="editorial-steps"><li><strong>Share your references.</strong> Tell us what you love, and what you prefer to avoid.</li><li><strong>Make it personal.</strong> Discuss skin sensitivities, hair, outfit and the finish you feel best in.</li><li><strong>Plan the timing.</strong> We’ll confirm preparation time, location and artist availability before booking.</li></ol>
          <Link className="text-link" href="/inquire?interest=makeup">Let’s create your look ↗</Link>
        </EditorialFeature>
        <div className="cards">
          <article className="info-card">
            <p className="eyebrow">PORTRAIT & GRADUATION</p>
            <h3>Makeup & hair</h3>
            <p className="price">From A$229</p>
            <p>
              Includes lashes, hairstyling and selected wardrobe options. Ask
              Hannah to coordinate a look with the studio’s collaborating
              artists.
            </p>
            <Link
              className="text-link"
              href="/inquire?session=portrait&interest=makeup"
            >
              Plan my look ↗
            </Link>
          </article>
          <article className="info-card">
            <p className="eyebrow">BRIDAL</p>
            <h3>Your wedding look</h3>
            <p className="price">From A$500</p>
            <p>
              Includes lashes, hairstyling, accessories and props. Bridal gowns
              and more elaborate styling can be discussed when planning your
              session.
            </p>
            <Link
              className="text-link"
              href="/inquire?session=wedding&interest=makeup"
            >
              Discuss bridal styling ↗
            </Link>
          </article>
          <article className="info-card">
            <p className="eyebrow">EVERYTHING TOGETHER</p>
            <h3>The styled portrait</h3>
            <p className="price">A$629</p>
            <p>
              90 minutes of photography with makeup, props, theme planning, a
              photographer and an assistant. Travel is additional.
            </p>
            <Link className="text-link" href="/inquire?package=portrait-styled">
              Explore this session ↗
            </Link>
          </article>
        </div>
        <section className="guide-section prose">
          <h2>A wardrobe with possibilities.</h2>
          <p>
            The styling collection includes over 100 outfits, including Hanfu,
            Japanese kimono, Lolita looks, occasion dresses and bridal gowns.
            Ask for the options available for your date, theme and size.
          </p>
          <h2>Choose a direction.</h2>
          <p>
            For light and airy portraits, consider fresh skin and soft textures.
            For film-inspired work, warm colour and textured fabrics work
            beautifully. Editorial sessions suit a more defined look, while
            cinematic portraits can make space for dramatic light and character.
          </p>
          <p>
            Partner availability and the final styling quote are confirmed
            individually.
          </p>
          <p>For a tailored wedding photography and makeup collection, packages start at A$999. Share your plans for a quote that confirms the coverage and styling included.</p>
        </section>
      </div>
    </main>
  );
}
