import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import EditorialFeature from "@/components/EditorialFeature";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Photography Scene Styling & Location Ideas Brisbane",
  "Scene styling ideas for graduation, registry, wedding and creative portrait sessions in Brisbane. Plan meaningful locations, props and visual details.",
  "/scene-styling",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro label="SET THE SCENE" title="A place. A feeling. Your story.">
        Thoughtful location and prop ideas, chosen to complement you and the way
        you want to remember the day.
      </PageIntro>
      <div className="page-content">
        <EditorialFeature image="/images/stories/garden-ceremony.webp" alt="A lakeside wedding ceremony with white chairs and a floral arch" eyebrow="SETTING THE FEELING" title="Let the place become part of it."><p>Soft garden light, a familiar city street, flowers that echo your outfit. The best setting gives your photographs a sense of place while keeping the attention on you.</p><p>Share a mood board or a favourite photograph. I can help suggest locations, colours and small details, and discuss suppliers where your plans need them.</p><Link className="text-link" href="/inquire?interest=scene-styling">Plan your setting ↗</Link></EditorialFeature>
        <div className="cards">
          {[
            [
              "A chapter on campus",
              "Return to a favourite building, a quiet walkway or the classroom where it started. Graduation gowns, a bear, scroll, certificate cover and artificial jacaranda flowers are available.",
              "graduation",
            ],
            [
              "A just-married city walk",
              "Keep the scene simple: your ceremony, a bouquet, beautiful architecture and time together. We’ll plan a portrait route around your registry booking.",
              "registry",
            ],
            [
              "A portrait with atmosphere",
              "A garden, an open landscape or a carefully styled corner can set the mood. Share references for flowers, fabric and props so we can plan the look and any additional costs.",
              "portrait",
            ],
          ].map(([title, body, session]) => (
            <article className="info-card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
              <Link
                href={"/inquire?session=" + session + "&interest=scene-styling"}
                className="text-link"
              >
                Plan this scene ↗
              </Link>
            </article>
          ))}
        </div>
        <section className="guide-section prose">
          <h2>Details worth planning.</h2>
          <p>
            Light changes through the day, so we’ll choose a time that suits
            your location and visual direction. Tell us about access, travel,
            outfit changes and any venue booking requirements.
          </p>
          <p>
            These are creative suggestions. Venue hire, flowers, installation,
            permits and external suppliers are quoted separately when needed.
            Ask Hannah for recommendations suited to your brief.
          </p>
          <Link className="button" href="/inquire?interest=scene-styling">
            Create a scene with me ↗
          </Link>
        </section>
      </div>
    </main>
  );
}
