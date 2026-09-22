# Release status — 2026-09-13

## Confirmed

- Existing production URL: https://sep-hannah-photography-portfolio-qt.vercel.app/
- Correct Vercel project: `qhannah923s-projects/sep-hannah-photography-portfolio-qtxk`.
- Existing GitHub repository: `QHannah923/SepHannah-Photography-Portfolio`, production branch `main`.
- Supabase resumed; schema and calendar-import migrations applied. Work calendar snapshot imported successfully (17 future busy periods).
- The studio redesign is live at the existing production URL. Vercel marked deployment `GhcwsrgMNTGZqF7evGcHmctfhZjV` Ready for source revision `8f7d28a779df96963148591b9d2d8c3e8db858ac`.

## Validation recorded on 2026-09-11

- Next.js 15.5.25 / React 19.3.0 production build passed (29 routes).
- PostCSS pinned and overridden to 8.5.28; npm reports zero known dependency vulnerabilities.
- Seven calendar tests passed.
- Local production-server checks passed: private routes reject anonymous access; studio login works; malformed requests are rejected; enquiry retries return the same record and private token; status lookup omits contact data; work-calendar conflicts prevent confirmation; confirmed orders hide slots and cancellation releases them. Test fixtures removed.
- Production verification on 2026-09-13 passed: public pages, configured admin login with Secure/HttpOnly cookies, private endpoint access control, imported work calendar, enquiry persistence, retry deduplication, private status lookup and sign-out. The labelled test record was removed.
- Resend reported Delivered to `qhanna000@gmail.com`; Hannah independently confirmed receiving the test notification.
- All eight settings are saved for Production. The four private values are stored as Secret, with no remaining secret-type warnings.

## Remaining studio setup

1. Publish the actual windows Hannah wishes to open at `/admin`. The busy calendar is not a declaration that every other time is available. No available windows were invented or published during launch checks.
2. The current Resend default sender can notify the registered owner address, which has been verified end to end. Before sending customer-facing emails or switching recipients, configure an owned and verified sending domain. Automated customer email is not enabled.
3. WeChat mini program development resumed at Hannah's request on 2026-09-22. Six pages now include reference-photo selection, a Brisbane calendar and enquiry progress. Eight logic tests and the source checks passed. There is still no registered AppID, Developer Tools/on-device verification, or platform approval. See `miniprogram/README.md` for the handoff.
4. Back-office login uses the private `STUDIO_ADMIN_PASSWORD` in the owner's `.env.local`. Do not send that password in chat or commit filled environment files. The Vercel value is now non-revealable.

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

## Mini program integration check — 2026-09-22

- Production `/api/studio` responded successfully and all nine mini program package prices matched.
- Production `/api/availability?month=2026-09` returned 503. A direct Supabase connectivity check failed with ENOTFOUND. The dashboard session has expired; owner login is required before the database state can be confirmed or restored. Do not treat this as a fully working live mini program integration.
- The browser policy blocks agent interaction with `mp.weixin.qq.com`. Hannah must register the mini program herself and provide its public AppID. No AppSecret is requested.
