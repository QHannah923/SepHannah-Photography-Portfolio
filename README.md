# SepHannah Studio

An English photography studio website for Brisbane, with a Chinese WeChat mini program sharing the same catalogue, availability and enquiry service. Built on Next.js and the existing Supabase project; deploy to the existing Vercel project.

## Local development

1. Install Node.js 22 and run `npm ci`.
2. Copy `.env.example` to `.env.local` and supply the private environment values. The studio password needs at least 16 characters, and the independent session secret at least 32.
3. Apply SQL files in `supabase/migrations` in filename order through the Supabase SQL editor. They preserve existing enquiries.
4. Run `npm run dev` and open http://127.0.0.1:3000.
5. Run `npm run build` before publishing. `npm run start -- --hostname 127.0.0.1` serves the production build.

Do not put `.env.local`, private calendar exports or service-role keys into Git, browser code or the mini program. iCloud can offload dependency files and make the first local launch slow; keep the project downloaded locally.

## Website

- Full-height four-part photographic opening: desktop vertical panels, phone horizontal rows, staggered 3D flip, split outline wordmark, hover / touch / keyboard access, reduced-motion fallback.
- Four photography collections, four aesthetic filters, accessible image viewer.
- Nine packages transcribed from Hannah’s price sheet, optional real 35mm film at A$100 per roll, makeup and scene-styling guides.
- Live published availability, enquiry form, private request tracking.
- Private studio manager at `/admin`: enquiries, quotes, deposits recorded manually, status changes, calendar windows and email-notification retry.
- Canonical URLs, route-specific metadata, service/package structured data, sitemap, robots rules, optimized local photographs.

The gallery’s aesthetic tags are initial editorial classifications. Check them against Hannah’s intended portfolio categories before treating them as definitive examples. No competitor photographs or package prices were copied.

## Booking operations

See [Studio operating guide](docs/STUDIO-GUIDE.md) for day-to-day use and [Release checklist](docs/RELEASE.md) for outstanding service connections.

## Validation

- `npm run build`: production compilation and type checks.
- `node scripts/check-services.mjs`: read-only database table connectivity.
- `node --test scripts/calendar.test.mjs`: calendar timezone, recurrence and privacy checks.
- `node scripts/check-flows.mjs`: with the local server running, tests authenticated access, validation, idempotent enquiries, request tracking, calendar conflicts and slot release. Creates clearly labelled fixtures in the configured database and deletes only those fixtures. If an email provider is configured, its one test enquiry can trigger a notification to the configured studio owner.
- `node scripts/sync-mini-catalog.cjs`: regenerate the mini program catalogue after changing `src/lib/studio.ts`.

## WeChat mini program

Import `miniprogram/` into WeChat Developer Tools. `touristappid` is a local development placeholder, not a registered studio account. A real AppID, permitted service domain, privacy declarations and platform review are required for distribution. Only a public website URL goes into `miniprogram/utils/api.js`.

The mini program contains the studio introduction, photo/category/style selection, packages with film option, availability, enquiry draft/retry, private request lookup, and Chinese session/booking guidance. No WeChat Pay or automated client messaging is enabled.
