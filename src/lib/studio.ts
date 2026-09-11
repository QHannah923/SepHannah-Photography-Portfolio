import type { Metadata } from "next";
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://sep-hannah-photography-portfolio-qt.vercel.app";
export const studio = {
  name: "SepHannah Studio",
  email: "qhanna000@gmail.com",
  wechat: "SepHannah",
  city: "Brisbane",
  timezone: "Australia/Brisbane",
};
export const styles = [
  {
    id: "airy",
    name: "Light & airy",
    zh: "清透感",
    description: "Soft light, fresh colours and a gentle, natural finish.",
  },
  {
    id: "film",
    name: "Film-inspired",
    zh: "胶片感",
    description:
      "Warm tones, gentle grain and a little nostalgia. Ask for real 35mm film if you love the analogue process.",
  },
  {
    id: "editorial",
    name: "Modern editorial",
    zh: "网感",
    description:
      "Confident portraits, considered styling and a polished, contemporary finish.",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    zh: "电影感",
    description:
      "Atmospheric light, rich colour and frames that feel like a scene from your story.",
  },
];
export const collections = [
  {
    slug: "weddings",
    name: "Weddings & pre-weddings",
    zh: "婚纱 / 婚礼",
    session: "wedding",
    image: "wedding2",
    headline: "A love like yours.",
    description:
      "Brisbane wedding and pre-wedding photography with room for the real moments. From a quiet first look to portraits in the last light, your day is photographed with care.",
    guide:
      "Share your ceremony time, locations and the moments you want to remember. Photography starts at A$300 per hour with a two-hour minimum; makeup and photography packages are also available.",
  },
  {
    slug: "graduation",
    name: "Graduation",
    zh: "毕业写真",
    session: "graduation",
    image: "graduation",
    headline: "The beginning of everything.",
    description:
      "Personal graduation photography in Brisbane. Celebrate the work, the friendships and the places that became part of your story.",
    guide:
      "We plan a route around the campus locations that matter to you. Bachelor’s and master’s gowns, a graduation bear, scroll, certificate cover and artificial jacaranda flowers are available. A doctoral gown is an additional A$20.",
  },
  {
    slug: "registry",
    name: "Registry ceremonies",
    zh: "领证跟拍",
    session: "registry",
    image: "ceremony1",
    headline: "Just you. Just married.",
    description:
      "Brisbane registry wedding photography for intimate ceremonies and the moments around them. A little time together, a walk through the city, and photographs of your new beginning.",
    guide:
      "The two-person or registry session is A$569 for 120 minutes. Tell us your ceremony time and venue so we can plan portraits around your booking.",
  },
  {
    slug: "portraits",
    name: "Portraits",
    zh: "主题写真",
    session: "portrait",
    image: "portrait3",
    headline: "A portrait of being you.",
    description:
      "Creative portrait photography in Brisbane, shaped around your personality. Choose soft natural light, nostalgic colour, modern editorial styling or a cinematic mood.",
    guide:
      "Outdoor portraits start at A$399 for 90 minutes. The A$629 styled portrait session combines 90 minutes of photography with makeup and styling, props, concept planning, a photographer and an assistant; travel is quoted separately.",
  },
];
export type Photo = {
  id: string;
  src: string;
  alt: string;
  collection: string;
  styles: string[];
};
export const photos: Photo[] = [
  {
    id: "wedding",
    src: "/images/wedding.jpg",
    alt: "A bride and groom celebrating together with a bouquet at sunset",
    collection: "weddings",
    styles: ["airy", "cinematic"],
  },
  {
    id: "wedding2",
    src: "/images/wedding2.jpg",
    alt: "Wedding portrait from Hannah’s wedding collection",
    collection: "weddings",
    styles: ["film"],
  },
  {
    id: "wedding3",
    src: "/images/wedding3.jpg",
    alt: "A wedding moment photographed by SepHannah Studio",
    collection: "weddings",
    styles: ["cinematic"],
  },
  {
    id: "graduation",
    src: "/images/graduation.jpg",
    alt: "Graduation portrait with an academic gown",
    collection: "graduation",
    styles: ["airy", "editorial"],
  },
  {
    id: "ceremony1",
    src: "/images/ceremony1.jpg",
    alt: "Newly married couple holding hands on a sunny Brisbane street",
    collection: "registry",
    styles: ["airy", "editorial"],
  },
  {
    id: "ceremony3",
    src: "/images/ceremony3.jpg",
    alt: "Couple portrait from Hannah’s registry ceremony collection",
    collection: "registry",
    styles: ["film"],
  },
  {
    id: "portrait",
    src: "/images/portrait.jpg",
    alt: "Creative portrait from SepHannah Studio’s portrait collection",
    collection: "portraits",
    styles: ["editorial"],
  },
  {
    id: "portrait2",
    src: "/images/portrait2.jpg",
    alt: "Portrait photographed in soft natural light",
    collection: "portraits",
    styles: ["airy"],
  },
  {
    id: "portrait3",
    src: "/images/portrait3.jpg",
    alt: "Close-up portrait with windswept hair and warm cinematic colour",
    collection: "portraits",
    styles: ["film", "cinematic"],
  },
];
export const packages = [
  {
    id: "grad-60",
    group: "graduation",
    name: "Graduation, simply",
    zh: "毕业写真 · 60分钟",
    price: 309,
    minutes: 60,
    details: [
      "60-minute session",
      "6 retouched photographs",
      "Graduation gown and props available",
    ],
    zhDetails: ["60分钟拍摄", "6张精修", "提供学士服及毕业道具"],
  },
  {
    id: "grad-90",
    group: "graduation",
    name: "The graduation story",
    zh: "毕业写真 · 90分钟",
    price: 339,
    minutes: 90,
    details: [
      "90-minute session",
      "9 retouched photographs",
      "A personalised campus route",
    ],
    zhDetails: ["90分钟拍摄", "9张精修", "定制校园路线"],
  },
  {
    id: "grad-duo",
    group: "graduation",
    name: "Graduate together",
    zh: "情侣双人毕业写真",
    price: 519,
    minutes: 120,
    details: [
      "120-minute two-person session",
      "10 retouched photographs",
      "Gowns and graduation props available",
    ],
    zhDetails: ["双人120分钟", "10张精修", "提供学士服及道具"],
  },
  {
    id: "portrait-90",
    group: "portrait",
    name: "A little time for you",
    zh: "主题外景写真",
    price: 399,
    minutes: 90,
    details: [
      "90-minute outdoor session",
      "9 retouched photographs",
      "Your choice of visual direction",
    ],
    zhDetails: ["外景90分钟", "9张精修", "自选拍摄风格"],
  },
  {
    id: "registry-duo",
    group: "registry",
    name: "Two of you",
    zh: "双人写真 / 领证跟拍",
    price: 569,
    minutes: 120,
    details: [
      "120-minute two-person or registry session",
      "10 retouched photographs",
      "Portraits planned around your ceremony",
    ],
    zhDetails: ["双人或领证120分钟", "10张精修", "根据仪式安排拍摄"],
  },
  {
    id: "portrait-styled",
    group: "portrait",
    name: "The styled portrait",
    zh: "一站式写真",
    price: 629,
    minutes: 90,
    details: [
      "90 minutes of photography",
      "Makeup, props and concept planning",
      "Photographer and assistant; travel extra",
    ],
    zhDetails: [
      "90分钟拍摄",
      "化妆师精妆造、道具、主题策划",
      "摄影师及助理；路费另计",
    ],
  },
  {
    id: "wedding-hourly",
    group: "wedding",
    name: "Your wedding, your way",
    zh: "婚纱 / 婚礼基础拍摄",
    price: 600,
    minutes: 120,
    from: true,
    details: [
      "A$300 per hour · 2-hour minimum",
      "Photographer, assistant, veil and props",
      "Discuss gowns and your preferred locations",
    ],
    zhDetails: [
      "每小时A$300，两小时起",
      "摄影师、助理、头纱及道具",
      "可咨询婚纱与场地",
    ],
  },
  {
    id: "wedding-styled",
    group: "wedding",
    name: "The bridal portrait",
    zh: "婚纱妆摄套餐",
    price: 1500,
    minutes: 90,
    details: [
      "1.5 hours of photography",
      "2–3 hours for makeup and styling",
      "30 retouched wedding portraits",
    ],
    zhDetails: ["拍摄1.5小时", "化妆及造型2–3小时", "婚纱写真30张精修"],
  },
  {
    id: "wedding-full",
    group: "wedding",
    name: "A day to remember",
    zh: "全天多造型婚纱",
    price: 2688,
    minutes: 360,
    from: true,
    details: [
      "4–6 hours of photography",
      "Two complete looks",
      "A tailored plan for your wedding portraits",
    ],
    zhDetails: ["拍摄4–6小时", "两套造型", "定制婚纱拍摄安排"],
  },
];
export const faqs = [
  {
    q: "How do I book?",
    a: "Choose a collection, package and preferred date, then send an enquiry. Hannah will confirm the schedule and final quote before you pay a deposit. Sending an enquiry does not reserve a time.",
  },
  {
    q: "When will I receive my photographs?",
    a: "The portrait guide lists 7–15 days for retouching. All usable original images are included, excluding unsuccessful frames. Confirm wedding delivery timing in your individual quote.",
  },
  {
    q: "What is the portrait deposit?",
    a: "The portrait guide lists A$40 per person, non-refundable and transferable, subject to applicable consumer rights. Wedding deposits are confirmed with your quote. No payment is taken on this website.",
  },
  {
    q: "Can I change my date?",
    a: "One change of session date is available. Further changes due to weather can be discussed with Hannah. Please get in touch before making new arrangements.",
  },
  {
    q: "Do you travel?",
    a: "Yes. Hannah is based in Brisbane and can travel elsewhere when flights and accommodation are covered. Outdoor travel beyond 5 km from the Brisbane southside base is charged separately; request an exact quote for your location.",
  },
  {
    q: "Can I choose the editing style?",
    a: "Yes. Send reference photographs and your retouching preferences before the session. A sample edit can be agreed before completing the gallery. Further revisions are not included after the finished set is delivered.",
  },
  {
    q: "Can I add photographs or more time?",
    a: "Additional retouching is A$15 per photograph, with an additional A$5 per person for group retouching. Portrait overtime is A$70 per 30 minutes. For arrival more than 15 minutes late, the guide lists A$20 per 15 minutes; discuss the effect on your session with Hannah.",
  },
  {
    q: "Is real film available?",
    a: "Yes. Add 35mm film photographed on a Nikon F100 for A$100 per roll, including processing. Film has natural variations; light leaks, focus differences and colour shifts may occur. Film-inspired digital editing is a separate aesthetic choice.",
  },
  {
    q: "Are there group discounts?",
    a: "For eligible 90-minute packages, book as a group of two for A$10 off per person, or three for A$15 off per person. Confirm the group schedule and final total with Hannah.",
  },
];
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: siteUrl + path },
  };
}
