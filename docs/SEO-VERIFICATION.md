# Verification — 22 October 2026

Scope: branch `codex/seo-service-pages`, based on main `48447afff107b0ba5aed27e61282fb113eddca8c`. Public homepage bytes matched that main revision exactly (SHA-256 `af1ee5b53cac10ff84d93270e91e3c1dafe2561b5ccb7fe717f1f0de344ebfa1`). Changes are not deployed to production before PR review.

## Automated

- `npm run build` generates the three service pages, shared organization data and sitemap without dependencies.
- `npm test` / `python3 scripts/check-site.py`: six HTML pages, local links and fragment targets, src/srcset references, CSS font references, one H1, lang, canonical, indexability, metadata, JSON-LD, sitemap and CNAME passed.
- `git diff --check` passed. CI also rebuilds and rejects uncommitted generated output.
- Local HTTP deep links: all three service directories returned 200; unknown route returned 404. Production equivalents must be retested after merge; they are not published by this PR alone.
- `house.js`, `house-motion.mjs`, `intro.js`, `intro-boot.js`, `about.js`, `main.js` unchanged byte-for-byte from main.
- Live HTTPS returned 200 with valid TLS. HTTP apex, HTTPS www, and old GitHub Pages root returned server-side 301 to HTTPS apex. Public robots and sitemap readable. No evidence of a crawl block in source/headers, but Google indexing not verified.

## Browser

Three service routes checked at 320, 390, 768 and 1440px: no horizontal overflow and no broken images. Visual inspection covered all three hero compositions on mobile/desktop and the long cladding headline at the tablet breakpoint. Native FAQ opened with Enter, related-service links navigated, homepage service link opened `/gluggaskipti/`, contact CTAs landed at email/phone content. Email and phone hrefs inspected; no messages or calls were sent. The page works as static HTML with no application JavaScript dependency. Service motion is CSS-only and explicitly gated behind `prefers-reduced-motion: no-preference`; an actual OS preference change was not tested.

Art-direction self-review (not a separate agent): replaced the cladding-page red-window image because it did not explain cladding, labelled the timber photograph as inspiration, and refined the long desktop heading to prevent an awkward break. Reinspected. Preserved home hero, portrait artwork, portfolio composition and existing motion code. Browser displayed the existing photographic service fallback; 3D GPU rendering was not newly verified in this environment.

## Lighthouse lab diagnostics

Lighthouse 12.8.2, headless Chrome, default simulated mobile throttling, local Python HTTP server. These are lab results, not CrUX/field data. Local server lacks production compression and cache headers. Compare only runs under the same conditions; production measurements may differ. No claim of measured INP (TBT is a different metric).

Initial service page: performance 88, accessibility/best practices/SEO 100, LCP 3.8s, CLS 0, TBT 0ms. After isolating CSS, reducing the header logo and WOFF2 fonts: see final table below.

Homepage local first-load performance improved from 83 / LCP 4.7s to 86 / LCP 4.1s; accessibility/best practices/SEO 100, CLS 0 and TBT 0ms. The existing signature intro affects the logo's LCP presentation. It was preserved as requested. The homepage lab LCP remains above 2.5s and is an explicit remaining performance limitation, not a passed Core Web Vitals claim. Validate with production PSI/CrUX and Search Console once data exists before deciding on a further intro tradeoff.

## Owner and post-merge gates

See [Icelandic owner handoff](SEO-HANDOFF.md) for Search Console DNS verification/sitemap submission, Business Profile verification, service area/hours/address visibility, factual approval and project photo collection. No GSC, GBP or actual ranking/traffic access was used. No review/rating/FAQ rich-result claims. Rich Results Test eligibility has not been claimed: JSON-LD syntax and internal consistency were checked locally.

## Final mobile lab results

| Page | Performance / Accessibility / Best practices / SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- |
| Forsíða | 86 / 100 / 100 / 100 | 4.1 s | 0 | 0 ms |
| Gluggaskipti | 99 / 100 / 100 / 100 | 2.1 s | 0 | 0 ms |
| Þakskipti | 96 / 100 / 100 / 100 | 2.7 s | 0 | 0 ms |
| Húsaklæðningar | 99 / 100 / 100 / 100 | 2.0 s | 0 | 0 ms |

## Client follow-up: additional services

Added a single editorial strip after the house story. Removed both old general-carpentry notes (3D and fallback); the three service names are real HTML text. Existing hero, project section and footer markup, and all prior interaction scripts, compare identically with the preceding commit. New reveal is isolated in `service-strip.js`: one 500ms opacity/8px entrance, no scroll interception, visible without JS, reduced-motion guard and cancellation.

Desktop 1440px and mobile 390px visually inspected; no overflow or duplicate notes. Build, link/schema checks and JS syntax pass. No full Lighthouse rerun for this isolated addition. BYKO and Danish-system slots remain null and generate no public section or claim. See [required owner evidence](SPECIALIZATIONS.md).
