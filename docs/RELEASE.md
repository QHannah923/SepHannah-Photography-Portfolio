# Release status — 2026-09-11

## Confirmed

- Existing production URL: https://sep-hannah-photography-portfolio-qt.vercel.app/
- Correct Vercel project: `qhannah923s-projects/sep-hannah-photography-portfolio-qtxk`.
- Existing GitHub repository: `QHannah923/SepHannah-Photography-Portfolio`, production branch `main`.
- Supabase resumed; schema and calendar-import migrations applied. Work calendar snapshot imported successfully (17 future busy periods).
- A redesign and booking-management implementation exist in the local checkout. This alone does not mean production has updated.

## Validation recorded on 2026-09-11

- Next.js 15.5.25 / React 19.3.0 production build passed (29 routes).
- PostCSS pinned and overridden to 8.5.28; npm reports zero known dependency vulnerabilities.
- Seven calendar tests passed.
- Local production-server checks passed: private routes reject anonymous access; studio login works; malformed requests are rejected; enquiry retries return the same record and private token; status lookup omits contact data; work-calendar conflicts prevent confirmation; confirmed orders hide slots and cancellation releases them. Test fixtures removed.
- Resend sender configuration is prepared; delivery is awaiting the production enquiry test.

## Required before a complete production handoff

1. Add `.env.example` variables to the correct Vercel project. Its Project and Shared environment-variable lists were empty when checked. The Supabase service-role key must stay server-only.
2. Set an independent private studio password and session secret. The owner must complete new credential entry in the Vercel UI. Do not send credentials in chat or commit a filled environment file.
3. Connect a Resend account and sender, set `RESEND_API_KEY`, `STUDIO_FROM_EMAIL`, and `STUDIO_OWNER_EMAIL`, then verify delivery to the studio inbox. Confirmed by Hannah on 2026-09-11: `qhanna000@gmail.com`. Resend account registered; a Sending access key is saved in the private local configuration. Production import is prepared for the owner. The default `onboarding@resend.dev` sender is prepared only for an initial delivery test to that same registered address; verify an owned sending domain for the finished studio setup.
4. Local build and booking-flow checks have passed; publish the validated revision, verify deployment Ready and HTTP responses at the existing domain.
5. Publish the actual windows Hannah wishes to open. The busy calendar is not a declaration that every other time is available.
6. Register the studio WeChat mini program using the owner’s account, supply its AppID, configure the service domain and privacy settings, verify in Developer Tools / on-device, and submit for review. No mini program has been registered or approved yet.

## Visual and operational limitations

The homepage implements desktop hover, touch and reduced-motion behaviour; production/mobile browser interaction testing is not yet recorded. The public web platform and Chinese mainland accessibility must be verified with the intended mini program environment before launch. iCloud calendar integration is manual snapshot import, not unattended continuous sync. Payment amounts are recorded manually; no payment processor or WeChat Pay integration is present.

## References used for design

- [One Avenue wedding packages](https://oneavenue.com.au/wedding-packages): prominent editorial package presentation and distinction between digital and 35mm film. User specifically approved this direction.
- Kinship by Kristy and Crafted Weddings: user approved earlier research references for photography-led navigation and visual restraint.

These are design references, not evidence of measured SEO performance or a guarantee of search ranking. SEO work here consists of indexable collection pages, accurate Brisbane service copy, page-specific titles/descriptions, canonical URLs, image compression and structured data.

## Provider documentation

- [Next.js 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15)
- [Resend Next.js integration](https://resend.com/docs/send-with-nextjs)
- [WeChat mini program development portal](https://developers.weixin.qq.com/miniprogram/dev/framework/)
