# Top Resume

A block-based resume builder. Compose your resume out of reorderable content
blocks, style it with themes and rich text, and export a pixel-accurate PDF
straight from the page. Sign in once and your resume autosaves to your account
and follows you across devices.

**Live:** [topresume.me](https://topresume.me) (marketing + docs) ·
[app.topresume.me](https://app.topresume.me) (the builder)

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [How it works](#how-it-works)
- [Releases](#releases)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

- **Block-based editor** — build your resume from draggable blocks (Work
  Experience, Education, custom sections). Blocks can be full-width or split
  into left/right halves for a two-column layout.
- **Rich text per element** — headings, bullet/numbered lists, bold, italic,
  subscript/superscript, and one-click case transforms (UPPERCASE, lowercase,
  Capitalize Each Word).
- **Per-element typography** — override the font family and size on any element,
  or reset back to the theme default at any time.
- **Optional dates** — attach a right-aligned date/date-range to any entry,
  baseline-aligned with the first line of content.
- **Themes** — several ready-made looks (Minimal, Classic Serif, Modern Sidebar,
  Creative Gradient, Bold Geometric, Doctor, Minecraft) with distinct fonts,
  accent colors, and page backgrounds.
- **Google Fonts** — a curated font list is loaded on demand as you use it.
- **Photo + contact header** — upload a photo and manage links/contact details.
- **WYSIWYG PDF export** — "Download PDF" prints the live preview through the
  browser, so the PDF matches exactly what you see (selectable, searchable text).
- **Word export** — download a `.docx` version of your resume.
- **Accounts & autosave** — sign in with email/password, Google, or Apple
  (Better Auth); every edit autosaves to a per-user Postgres row on Neon.
- **Photo storage** — photos are downscaled client-side and stored in Vercel
  Blob, access-scoped to your account.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router) + [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Tiptap](https://tiptap.dev/) v3 for rich text editing
- [dnd-kit](https://dndkit.com/) for drag-and-drop reordering
- [docx](https://docx.js.org/) for Word export; browser print for PDF
- [Better Auth](https://www.better-auth.com/) + [Drizzle](https://orm.drizzle.team/)
  on [Neon](https://neon.tech/) Postgres; [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
  for photos
- [Motion](https://motion.dev/) + [Lenis](https://lenis.darkroom.engineering/)
  for the marketing site's scroll animations
- [Turborepo](https://turbo.build/) + [bun](https://bun.sh/) for the monorepo

## Project structure

```
.
├── apps/
│   ├── web/                     # The builder app → app.topresume.me
│   │   ├── app/                 # App Router entry, auth routes, global + print CSS
│   │   ├── components/resume/   # Editor UI, preview, toolbars, pickers
│   │   └── lib/                 # Resume state/themes/exports, auth, db
│   └── site/                    # Marketing + docs site → topresume.me
│       ├── app/                 # Landing page and /docs pages
│       └── components/          # Hero, reveals, smooth scroll, docs nav
└── packages/
    ├── ui/                      # Shared UI component library (@workspace/ui)
    ├── eslint-config/           # Shared ESLint config
    └── typescript-config/       # Shared tsconfig bases
```

## Getting started

Prerequisites: [bun](https://bun.sh/) `1.3+`, Node.js `>=20`, and a
[Neon](https://neon.tech/) Postgres database (free tier is fine for local dev).

```bash
# Install dependencies
bun install

# Configure the builder app (database, auth, blob storage)
cp apps/web/.env.example apps/web/.env.local   # then fill in the values —
                                                # see "Environment variables" below

# Push the schema to your database (run from apps/web)
cd apps/web && bun run db:push && cd ../..

# Start the dev servers (web → :3000, site → :3001)
bun dev
```

The `site` app (marketing/docs) runs standalone and needs no environment
variables. Only `web` (the builder) needs the `.env.local` from the step above.

### Common scripts

Run from the repo root (they fan out through Turborepo):

| Command          | Description                          |
| ---------------- | ------------------------------------ |
| `bun dev`        | Start the development server         |
| `bun run build`  | Production build                     |
| `bun run lint`   | Lint all packages                    |
| `bun run format` | Format with Prettier                 |
| `bun typecheck`  | Type-check all packages              |

Database scripts (Drizzle) are scoped to `apps/web` — run them with
`cd apps/web && bun run <script>`:

| Command             | Description                                    |
| ------------------- | ----------------------------------------------- |
| `db:generate`       | Generate a new migration from schema changes     |
| `db:migrate`        | Apply pending migrations                         |
| `db:push`           | Push the current schema straight to the database (fastest for local dev) |
| `db:studio`         | Open Drizzle Studio to browse/edit data          |

## Environment variables

Only `apps/web` needs configuration — copy `apps/web/.env.example` to
`apps/web/.env.local` and fill in:

| Variable                                                    | Needed for                                                          |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `DATABASE_URL`                                                | Neon Postgres connection string (pooled)                             |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_TRUSTED_ORIGINS` | Auth session signing and allowed origins                    |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                     | "Sign in with Google"                                                |
| `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | "Sign in with Apple" |
| `BLOB_READ_WRITE_TOKEN`                                        | Vercel Blob storage for uploaded photos                              |

Every variable is commented in `apps/web/.env.example` with where to get it
(Neon dashboard, Google Cloud Console, Apple Developer portal, Vercel).
Email/password sign-in works without any OAuth variables set — only add the
Google/Apple ones if you need to test those sign-in flows locally.

## How it works

The entire resume lives in a single `ResumeData` object managed by a reducer
(`lib/resume/reducer.ts`) and autosaved to a per-user row in Postgres. The
on-screen preview (`components/resume/resume-preview.tsx`) renders that state
into paginated A4 pages. PDF export doesn't reconstruct the document — it
prints the live preview via a print stylesheet (`app/resume-print.css`), which
is why the output matches the editor exactly.

## Releases

Releases are fully automated with [semantic-release](https://semantic-release.gitbook.io/):
every push to `main` is scanned for [Conventional Commits](https://www.conventionalcommits.org/)
(see [VERSIONING.md](./VERSIONING.md)), and if the commits warrant a release,
it bumps the version, updates `CHANGELOG.md`, tags the commit, and publishes
a GitHub Release automatically. No manual version input or release PR needed.

## Contributing

Contributions are welcome. Please read our
[Code of Conduct](./CODE_OF_CONDUCT.md) and the [versioning policy](./VERSIONING.md)
before opening a pull request. Run `bun run lint` and `bun typecheck` before
submitting.

## Security

If you discover a security vulnerability, please follow the responsible
disclosure process in [SECURITY.md](./SECURITY.md) rather than opening a
public issue.

## License

[MIT](./LICENSE.md)
