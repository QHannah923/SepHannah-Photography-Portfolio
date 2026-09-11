import PageIntro from "@/components/PageIntro";
import { pageMetadata, studio } from "@/lib/studio";
export const metadata = pageMetadata(
  "Privacy & Your Enquiry",
  "How SepHannah Studio uses information submitted through its photography enquiry form and booking tools.",
  "/privacy",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro label="YOUR INFORMATION" title="A little clarity.">
        How your enquiry details are used.
      </PageIntro>
      <div className="page-content prose">
        <h2>What we collect</h2>
        <p>
          When you enquire, we collect the name, contact details, session
          preferences, location, message and preferred times you choose to
          provide. A booking reference lets you check the progress of your
          request.
        </p>
        <h2>How it is used</h2>
        <p>
          Your details help Hannah reply, prepare a quote and manage your
          session. Enquiries are stored using Supabase and email notifications
          are sent to the studio through its configured email provider. The
          website is hosted on Vercel. These services may process information
          outside your country.
        </p>
        <h2>Photographs and sharing</h2>
        <p>
          The studio’s photography guide allows finished photographs to be
          shared on social platforms. Tell Hannah before booking if you would
          like your photographs kept private, so your preference can be recorded
          and agreed.
        </p>
        <h2>Your choices</h2>
        <p>
          Contact{" "}
          <a className="text-link" href={"mailto:" + studio.email}>
            {studio.email}
          </a>{" "}
          to request access, correction or deletion of your enquiry details, or
          to discuss photograph privacy. Booking records may need to be retained
          for ongoing sessions or applicable record-keeping requirements.
        </p>
        <h2>Cookies and stored data</h2>
        <p>
          The studio manager uses a secure sign-in cookie. The customer website
          does not add advertising trackers. The WeChat mini program stores
          enquiry drafts and private booking references on your device so you
          can return to your requests; keep your device and references private.
        </p>
      </div>
    </main>
  );
}
