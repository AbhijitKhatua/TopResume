import {
  ArrowRight,
  Blocks,
  CloudUpload,
  FileDown,
  LayoutPanelLeft,
  Palette,
  Type,
} from "lucide-react";

import { Hero } from "@/components/home/hero";
import { Reveal } from "@/components/reveal";

const APP_URL = "https://app.topresume.me";

const FEATURES = [
  {
    icon: Blocks,
    title: "Block-based editing",
    body: "Every section is a draggable block. Reorder with a grip, collapse what you're not working on, and cap sections at exactly what you need.",
  },
  {
    icon: Type,
    title: "Real rich text",
    body: "Headings H2–H5, bullet and numbered lists, bold, italic, sub/superscript, and one-click case transforms — mixed freely inside any block.",
  },
  {
    icon: Palette,
    title: "Hand-tuned themes",
    body: "Seven themes from minimal to gradient, each with its own font pairing, accent color, and page background. Swap without losing content.",
  },
  {
    icon: LayoutPanelLeft,
    title: "Flexible layouts",
    body: "Full-width or half-width blocks with left/right alignment, per-element date labels, and an adjustable page margin from tight to airy.",
  },
  {
    icon: FileDown,
    title: "Pixel-perfect exports",
    body: "The live A4 preview is the document. Export a WYSIWYG PDF or a structured Word (.docx) file with headings and lists preserved.",
  },
  {
    icon: CloudUpload,
    title: "Autosave everywhere",
    body: "Your resume saves to your account as you type and syncs across devices. Sign in with email, Google, or Apple.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Add your details",
    body: "Sign in and fill the personal panel — name, title, contact, links, photo, and a short summary. The A4 preview updates as you type.",
  },
  {
    step: "02",
    title: "Stack and style your blocks",
    body: "Add sections for experience, education, skills — anything. Drag to reorder, set widths, pick fonts and sizes, and choose a theme.",
  },
  {
    step: "03",
    title: "Export and apply",
    body: "Download a pixel-perfect PDF or a Word file. Extra pages are added automatically as your content grows — no layout surprises.",
  },
];

const THEMES = [
  { name: "Minimal", swatch: "bg-zinc-100", ink: "bg-zinc-800" },
  { name: "Classic Serif", swatch: "bg-orange-50", ink: "bg-orange-900" },
  { name: "Modern Sidebar", swatch: "bg-teal-700", ink: "bg-white" },
  { name: "Creative Gradient", swatch: "bg-gradient-to-br from-fuchsia-200 via-violet-100 to-blue-100", ink: "bg-fuchsia-700" },
  { name: "Bold Geometric", swatch: "bg-amber-100", ink: "bg-amber-600" },
  { name: "…and more", swatch: "bg-white/10", ink: "bg-white/60" },
];

const FAQS = [
  {
    q: "Is Top Resume free?",
    a: "Yes — the builder is completely free while it's in alpha. Create an account, build, and export as much as you like.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. An account (email/password, Google, or Apple) is what lets your resume autosave and follow you across devices.",
  },
  {
    q: "What can I export?",
    a: "A pixel-perfect PDF straight from the live A4 preview, or a structured Word (.docx) file with headings, lists, and formatting preserved.",
  },
  {
    q: "Will the PDF match what I see?",
    a: "Yes — the preview is the document. One tip: for themes with colored or gradient backgrounds, enable “Background graphics” in your browser's print dialog.",
  },
  {
    q: "Can I use my own fonts?",
    a: "Pick any font from the Google Fonts catalog, per element or per theme. Fonts load on demand, so your resume stays fast.",
  },
  {
    q: "Is my data safe?",
    a: "Resumes are stored per-account in a Postgres database, and photos are access-scoped to your user — other accounts can't read them.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
        <Reveal>
          <p className="text-sm font-medium tracking-widest text-accent uppercase">Features</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything you need, nothing you have to fight.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl border border-line bg-white/[0.03] p-6 transition-colors hover:border-accent/40 hover:bg-white/[0.05]">
                <span className="inline-grid size-10 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-soft/20 text-accent">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-line bg-white/[0.02]">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-accent uppercase">How it works</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              From blank page to interview-ready in three steps.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.12}>
                <div className="relative">
                  <span className="bg-gradient-to-b from-white/25 to-transparent bg-clip-text text-6xl font-semibold text-transparent">
                    {step.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Themes marquee */}
      <section id="themes" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="text-sm font-medium tracking-widest text-accent uppercase">Themes</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              One resume, seven personalities.
            </h2>
            <p className="mt-4 max-w-lg text-muted">
              Swap themes any time — your content stays put while fonts, accents,
              and page backgrounds change around it.
            </p>
          </Reveal>
        </div>

        <Reveal className="marquee mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track flex w-max gap-5 pr-5">
            {[...THEMES, ...THEMES].map((theme, i) => (
              <div
                key={`${theme.name}-${i}`}
                className="w-56 shrink-0 rounded-2xl border border-line bg-white/[0.03] p-4"
              >
                <div className={`aspect-[210/130] overflow-hidden rounded-lg ${theme.swatch} p-3`}>
                  <div className={`h-2 w-20 rounded-full ${theme.ink}`} />
                  <div className="mt-2 space-y-1.5 opacity-60">
                    <div className={`h-1 w-full rounded-full ${theme.ink}`} />
                    <div className={`h-1 w-4/5 rounded-full ${theme.ink}`} />
                    <div className={`h-1 w-11/12 rounded-full ${theme.ink}`} />
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium">{theme.name}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-line">
        <div className="mx-auto max-w-3xl scroll-mt-24 px-4 py-24 sm:px-6">
          <Reveal>
            <p className="text-center text-sm font-medium tracking-widest text-accent uppercase">FAQ</p>
            <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Questions, answered.
            </h2>
          </Reveal>

          <div className="mt-12 space-y-3">
            {FAQS.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <details className="faq group rounded-xl border border-line bg-white/[0.03] transition-colors open:bg-white/[0.05]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium">
                    {faq.q}
                    <span className="faq-chevron grid size-6 shrink-0 place-items-center rounded-full border border-line text-muted">
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent/15 via-transparent to-accent-soft/15 px-6 py-16 text-center sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-lg -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(240,171,252,0.25),transparent)] blur-xl"
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Your next role is one great resume away.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Free while in alpha. No credit card, no watermark — just a resume
              you&apos;re proud to send.
            </p>
            <a
              href={APP_URL}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 font-medium text-background transition-transform hover:scale-[1.03] active:scale-100"
            >
              Open the builder
              <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
