# site — topresume.me

The marketing + docs website, served at the apex domain **topresume.me**.
The builder app (`apps/web`) lives at **app.topresume.me**.

- **Next.js** (App Router, fully static output) + **Tailwind CSS v4**
- **Lenis** — smooth wheel/touch scrolling (disabled under `prefers-reduced-motion`)
- **Motion** — scroll-triggered reveals, hero parallax, header scroll progress
- Docs under `/docs` with a grouped sidebar and prev/next pager

## Develop

```bash
bun install            # from the repo root
bun run dev            # turbo runs all apps; site is on http://localhost:3001
```

Or just this app: `cd apps/site && bun run dev`.

## Deploy (Vercel)

Create a **second Vercel project** from this same GitHub repo:

1. Import the repo again in Vercel and set **Root Directory** to `apps/site`.
2. Add the domain `topresume.me` (apex) to that project
   (A record `76.76.21.21`, or ALIAS/ANAME if your DNS supports it).
3. `app.topresume.me` (CNAME `cname.vercel-dns.com`) stays on the builder-app
   project (Root Directory `apps/web`).
