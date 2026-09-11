import PageIntro from "@/components/PageIntro";
import BookingStatus from "@/components/BookingStatus";
export const metadata = {
  title: "My Photography Request",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main id="main">
      <PageIntro label="MY REQUEST" title="Your next chapter, in progress.">
        Use the private tracking code saved after your enquiry. If you no longer
        have it, contact Hannah directly.
      </PageIntro>
      <div className="page-content prose">
        <BookingStatus />
      </div>
    </main>
  );
}
