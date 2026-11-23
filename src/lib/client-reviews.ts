// Publish only client-approved words and display names. Never seed with sample reviews.
export type ClientReview = { name: string; session: string; quote: string };
export const clientReviews: ClientReview[] = [
  {
    name: "A note from a client",
    session: "Translated from a private message in Mandarin",
    quote: "You’re a photography genius!",
  },
  {
    name: "A note from a wedding client",
    session: "Excerpt translated from a private message in Mandarin",
    quote: "I couldn’t help opening the photos again. I was going to choose a few to save, but in the end I saved every one. They have so much feeling. They’re all so beautiful, they brought tears to my eyes. Thank you.",
  },
];
