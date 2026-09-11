import { Suspense } from "react";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import InquiryForm from "@/components/InquiryForm";
import { pageMetadata, studio } from "@/lib/studio";
export const metadata = pageMetadata(
  "Book a Photography Session Brisbane",
  "Enquire about weddings, graduation portraits, registry ceremonies and portrait sessions with Brisbane photographer Hannah.",
  "/inquire",
);
export default function Page() {
  return (
    <main id="main">
      <PageIntro
        label="LET’S CREATE SOMETHING PERSONAL"
        title="Tell me your story."
      >
        A date, an idea, a little about you. Let’s start there.
      </PageIntro>
      <div className="page-content two-column">
        <aside>
          <p className="eyebrow">YOUR PHOTOGRAPHER, ONE MESSAGE AWAY</p>
          <h3>
            Good photographs
            <br />
            start with a connection.
          </h3>
          <p>
            Share your plans and the feeling you’re drawn to. I’ll help you find
            the right package, location and time.
          </p>
          <p>
            <a className="text-link" href={"mailto:" + studio.email}>
              {studio.email}
            </a>
          </p>
          <p>
            WeChat: <strong>{studio.wechat}</strong>
          </p>
          <p className="muted">
            Based in Brisbane. Travel available with flights and accommodation
            covered.
          </p>
          <Link className="text-link" href="/pricing">
            See packages & frequently asked questions ↗
          </Link>
        </aside>
        <Suspense fallback={<p>Preparing your enquiry…</p>}>
          <InquiryForm />
        </Suspense>
      </div>
    </main>
  );
}
