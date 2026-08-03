# PALAK — Editorial Portfolio

A cinematic, magazine-style portfolio built with Next.js 15, TypeScript, Tailwind CSS v4, GSAP + Lenis, and a touch of Framer Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Editing content — one file

Everything a client would ever change lives in **`content/site.json`**: name, roles, the opening sentence, story headlines, statements, the about paragraph, projects (name / category / campaign / year / description / image), UGC films, the introduction film, quotes, the closing image sequence, and contact links (Instagram, email, portfolio PDF). Edit the JSON, refresh — no code involved.

## Photography & film

Real photography lives in `public/images/` (web-optimized JPEGs), UGC films in `public/videos/`. To swap or add an image:

1. Drop the image into `public/images/` and point the relevant `site.json` field at it.
2. Run `npm run blur` to regenerate blur-up placeholders (`lib/blur-map.json`). Images without an entry simply load without a blur, so this step is optional but nice.

Videos: paste a file path or URL into the `video` fields in `site.json` (`ugc.items[].video`, `film.video`) — a Cloudinary/CDN URL works as-is, so offloading video hosting later is a JSON edit only. Empty string = quiet placeholder poster; a value = hover-to-play + fullscreen (UGC) or autoplaying muted loop (introduction film). The layout does not change either way.

## Cloudinary (recommended: keep media out of the repo)

One-time setup, then fully automated:

1. Create a free account at cloudinary.com, open **Dashboard → API Keys**.
2. `cp .env.example .env` and fill in the three values (`.env` is git-ignored).
3. `npm run cloudinary`

The script uploads everything in `public/images` and `public/videos` to a `palak-portfolio` folder on Cloudinary (idempotent — re-runs overwrite in place) and rewrites `content/site.json` to the delivered URLs with `f_auto,q_auto` optimization. After verifying the site locally, delete the local media from `public/images` and `public/videos` — blur placeholders keep working because they're keyed by filename.

The introduction film (`film.video`) is still awaiting the client's cinematic video — its poster frame is live in the meantime.

The portfolio PDF is `public/portfolio.pdf` — replace the placeholder file.

Before launch, set the real domain in `metadataBase` (`app/layout.tsx`).

## Design system

- Ivory `#FAF8F5` / charcoal `#111111`, warm beige tones, one muted gold accent (`#A8895B`).
- Cormorant Garamond (display serif) + Inter (supporting sans), loaded via `next/font`.
- Animation: Lenis smooth scroll synced to GSAP's ticker; mask reveals, line-by-line type, a pinned closing crossfade sequence. Everything respects `prefers-reduced-motion` (animations are skipped, content is always visible).
- Micro-interactions: 2–3 % image scale on hover, a minimalist circle cursor over media, film grain at 5 % opacity, a hairline scroll progress indicator on the right.
