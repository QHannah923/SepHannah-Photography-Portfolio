import Image from "next/image";
import Link from "next/link";
import ContactLinks from "./ContactLinks";
import { Suspense } from "react";
import QuickInquiryForm from "./QuickInquiryForm";
import { clientReviews } from "@/lib/client-reviews";
import { faqs, studio } from "@/lib/studio";

const moments = [
  { image: "bridal-preparations", alt: "A bride smiling in the makeup mirror", number: "01", title: "Before the first look.", copy: "The quiet anticipation. The finishing touches. A moment to take it all in." },
  { image: "chapel-celebration", alt: "Guests celebrating the newlyweds in a sunlit chapel", number: "02", title: "Everyone you love.", copy: "The vows, the laughter, the people who made the day feel like yours." },
  { image: "afterglow", alt: "A newly married couple holding hands beside a lake at dusk", number: "03", title: "Just a little longer.", copy: "A walk together as the light fades. A few photographs with room to breathe." },
];

export function StorySection() {
  return (
    <section className="section story-section" aria-labelledby="story-title">
      <div className="section-heading">
        <div><p className="eyebrow">A WEDDING IS MORE THAN A PORTRAIT</p><h2 id="story-title">The little moments.<br /><em>The whole feeling.</em></h2></div>
        <p>From getting ready to the last light, I look for the gestures and connections that make your photographs yours.</p>
      </div>
      <div className="story-grid">
        {moments.map((moment) => (
          <article key={moment.number}>
            <Link className="story-image" href="/collections/weddings" aria-label={moment.title + " Explore wedding photographs"}>
              <Image src={`/images/stories/${moment.image}.webp`} alt={moment.alt} fill sizes="(max-width: 700px) 90vw, 30vw" />
              <span>{moment.number}</span>
            </Link>
            <h3>{moment.title}</h3><p>{moment.copy}</p>
          </article>
        ))}
      </div>
      <Link href="/collections/weddings" className="text-link">Step inside the wedding collection ↗</Link>
    </section>
  );
}

export function CollectionFeature() {
  return (
    <section className="collection-feature" id="your-collection" aria-labelledby="collection-title">
      <div className="collection-feature-photo">
        <Image src="/images/stories/just-married.webp" alt="A newly married couple celebrating beside their lakeside ceremony" fill sizes="(max-width: 760px) 100vw, 48vw" />
        <span>YOUR PEOPLE. YOUR PACE. YOUR DAY.</span>
      </div>
      <div className="collection-feature-copy">
        <p className="eyebrow">YOUR WEDDING COLLECTION</p>
        <h2 id="collection-title">One beautiful day.<br /><em>Every part of you.</em></h2>
        <p>Build a collection around the way you want to remember it. Thoughtful photography, a makeup look that feels like you, and the option to add the texture of real film.</p>
        <dl className="collection-inclusions">
          <div><dt>Photography, with feeling</dt><dd>Space for candid moments and gentle direction when you need it.</dd></div>
          <div><dt>Makeup, made personal</dt><dd>A look shaped around your features, your style and your preferences.</dd></div>
          <div><dt>A plan that fits your day</dt><dd>We talk through your locations, timing and the photographs that matter most.</dd></div>
        </dl>
        <p className="collection-from">Photography + makeup <strong>from $999</strong><small>AUD · A tailored quote confirms coverage and inclusions.</small></p>
        <div className="inline-links"><Link className="button" href="/inquire?session=wedding">Let’s plan your collection ↗</Link><Link className="text-link" href="/pricing">All packages ↗</Link></div>
      </div>
    </section>
  );
}

export function ClientWords() {
  const reviewEmail = `mailto:${studio.email}?subject=${encodeURIComponent("My SepHannah Studio experience")}&body=${encodeURIComponent("Hi Hannah,\n\nMy session:\nMy experience:\nName I’d like displayed:\n\nMay you publish these words on your website? Yes / No\n")}`;
  return (
    <section className="section client-words" id="client-stories" aria-labelledby="client-title">
      <p className="eyebrow">AFTER THE PHOTOGRAPHS</p>
      <h2 id="client-title">Your experience.<br /><em>In your words.</em></h2>
      {clientReviews.length > 0 ? <div className="review-grid">{clientReviews.map((review) => <figure key={review.name + review.session}><blockquote>“{review.quote}”</blockquote><figcaption>{review.name}<span>{review.session}</span></figcaption></figure>)}</div> : <p className="review-invitation">Already spent a little time in front of my camera? I’d love to hear what the experience meant to you, and which photographs you keep coming back to.</p>}
      <a className="text-link" href={reviewEmail}>Share your experience ↗</a>
      <p className="review-note">Your words are only shared with your permission.</p>
    </section>
  );
}

export function HomeFAQ() {
  const questions = [
    { q: "We’re a little camera shy. Will you help us?", a: "Absolutely. You don’t need to arrive knowing how to pose. I’ll help you find the light, give you something natural to do together, and leave space for the moments in between." },
    faqs[0],
    { q: "Can we book photography and makeup together?", a: "Yes. Tailored photography and makeup packages start at A$999. Share your date, location and ideas so we can confirm the right coverage, styling and inclusions. Dedicated portrait and bridal packages are also listed on the pricing page." },
    faqs[7], faqs[1], faqs[4], faqs[3],
  ];
  return (
    <section className="section home-questions" id="questions" aria-labelledby="questions-title">
      <div><p className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p><h2 id="questions-title">Before<br /><em>we begin.</em></h2><p>Good plans start with a conversation. Here are a few answers to make the first step easier.</p><Link href="/inquire" className="text-link">Ask Hannah something else ↗</Link></div>
      <div className="faq">{questions.map(({ q, a }, index) => <details key={q}><summary><span className="question-number">{String(index + 1).padStart(2, "0")}</span>{q}<span className="question-toggle" aria-hidden="true">+</span></summary><p>{a}</p></details>)}<Link className="text-link faq-more" href="/pricing">View packages & all booking details ↗</Link></div>
    </section>
  );
}

export function HomeContact() {
  return (
    <section className="section home-contact" id="enquire" aria-labelledby="contact-title">
      <div className="home-enquiry-grid"><div><p className="eyebrow">BRISBANE & WHERE YOUR STORY TAKES US</p><h2 id="contact-title">Start with<br /><em>a little hello.</em></h2><p>A date, a place, an idea. Tell me what you’re imagining, and we’ll work out the details together.</p><p>Weddings, engagements, graduations, family and personal portraits. Your style, thoughtfully customised.</p></div><Suspense fallback={<p>Preparing your enquiry form…</p>}><QuickInquiryForm /></Suspense></div>
      <ContactLinks />
    </section>
  );
}
