import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import EditorialFeature from "@/components/EditorialFeature";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Meet Hannah, Brisbane Photographer",
  "Meet Hannah of SepHannah Studio: wedding, graduation, registry and portrait photography in Brisbane, with travel available.",
  "/about",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro label="THE PERSON BEHIND THE CAMERA" title="Hi, I’m Hannah.">
        Brisbane photographer. Drawn to real moments, good light, and the
        stories people carry with them.
      </PageIntro>
      <div className="page-content">
        <EditorialFeature image="/images/stories/walking-together.webp" alt="A bride and groom laughing together during their wedding portraits" eyebrow="THE WAY I SEE IT" title="Room for the real moments."><p>I photograph weddings, engagements, graduations, families and personal portraits. Before we meet, I’d love to hear who’s coming, where you feel at home and which photographs you’d love to keep.</p><p>I’ll help you find good light and give you something natural to do together. There’s always room for a laugh, a quiet moment or a change of plan.</p><p>English and Mandarin are both welcome. Based in Brisbane, available to travel.</p><Link className="text-link" href="/inquire">Tell me a little about you ↗</Link></EditorialFeature>
        <div className="prose">
          <h2>Space to be yourself.</h2>
          <p>
            SepHannah Studio is my collection of real days and real people. I
            photograph weddings, graduations, registry ceremonies and personal
            portraits, with a visual direction shaped around you.
          </p>
          <p>
            We start with a conversation: the places that matter, the
            photographs you keep coming back to, and how you want the day to
            feel. There’s room for gentle direction, spontaneous moments, and a
            little adventure.
          </p>
          <h2>Brisbane, and wherever your story takes us.</h2>
          <p>
            I’m based in Brisbane and available to travel when flights and
            accommodation are covered. Share your location and plans, and I’ll
            put together a quote.
          </p>
          <div className="inline-links">
            <Link className="button" href="/inquire">
              Let’s get to know you ↗
            </Link>
            <Link className="text-link" href="/collections">
              Explore my work ↗
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
