import StudioManager from "@/components/StudioManager";
import PageIntro from "@/components/PageIntro";
export const metadata = {
  title: "Studio Manager",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main">
      <PageIntro
        label="PRIVATE / SEPHANNAH STUDIO"
        title="Your studio, together."
      />
      <div className="page-content">
        <StudioManager />
      </div>
    </main>
  );
}
