import PageIntro from "@/components/PageIntro";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { pageMetadata } from "@/lib/studio";
export const metadata = pageMetadata(
  "Photography Availability Brisbane",
  "Check open session dates for SepHannah Studio in Brisbane and send a photography booking enquiry.",
  "/availability",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro
        label="LET’S FIND YOUR DATE"
        title="Time for something special."
      >
        Explore the dates open for enquiries. A time is reserved only after
        Hannah confirms your session and deposit arrangements.
      </PageIntro>
      <div className="page-content">
        <AvailabilityCalendar />
      </div>
    </main>
  );
}
