# SepHannah Photography Portfolio + Link-in-Bio

Photography portfolio with WeChat, Instagram, Xiaohongshu, Douyin, and email links.

## Features

- **Portfolio grid** with categories and captions
- **Link-in-bio** style contact blocks, mobile-friendly
- **Booking form** — saves enquiries to **Supabase** (table `inquiries`); see `.env.example` and `supabase-inquiries.sql`
- **Static config** — edit `src/lib/config.ts`

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customise

Edit `src/lib/config.ts`:

- **photographer** — name, tagline, bio, optional avatar
- **socialLinks** — labels, values, URLs
- **portfolio** — titles, descriptions, image paths, categories

## Deploy

```bash
npm run build
npm start
```

Deploy on [Vercel](https://vercel.com), etc. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the project **Environment Variables** so the booking form works.
