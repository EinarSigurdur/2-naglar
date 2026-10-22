# 2 Naglar

Static website for **https://2naglar.is/**. GitHub Pages publishes the repository root of `main`.

## Edit and verify

- `scripts/services.mjs`: Icelandic service copy and page-specific facts.
- `scripts/build-services.mjs`: static service HTML, shared business JSON-LD and sitemap.
- `service-pages.css`: service layouts, scoped away from the homepage.
- `index.html`, `style.css`, existing JavaScript: homepage and its preserved interactions.

```sh
npm run build
npm test
npm run preview
```

No npm dependencies are required. Node 22+ and Python 3 are sufficient. Commit generated HTML alongside source changes; Pages requires no build server. CI checks local links, anchors, assets, schema, canonical pages and reproducible output. Preview at http://127.0.0.1:4174/.

Work on a branch and review the pull request before merging. Do not overwrite this repository with an older local `dist` build that lacks service pages.

[SEO handoff and owner checklist](docs/SEO-HANDOFF.md) · [Verification](docs/SEO-VERIFICATION.md)
