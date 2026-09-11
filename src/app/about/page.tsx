import Link from "next/link";
import PageIntro from "@/components/PageIntro";
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
