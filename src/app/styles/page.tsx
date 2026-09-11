import PageIntro from "@/components/PageIntro";
import Gallery from "@/components/Gallery";
import { photos, styles, pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Find Your Photography Style",
  "Explore light and airy, film-inspired, modern editorial and cinematic portrait and wedding photographs.",
  "/styles",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro label="FIND YOUR FEELING" title="Same you. A different mood.">
        Choose the colours, light and atmosphere you love. We’ll bring your
        references together into a direction that feels personal.
      </PageIntro>
      <div className="page-content">
        <div className="style-descriptions">
          {styles.map((s) => (
            <div key={s.id}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
        <Gallery photos={photos} />
      </div>
    </main>
  );
}
