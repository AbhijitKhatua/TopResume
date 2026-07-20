"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { AnimatedResumeMockup } from "@/components/home/animated-mockup";

const APP_URL = "https://app.topresume.me";
const RELEASES_URL = "https://github.com/AbhijitKhatua/TopResume/releases";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const mockupY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : -90]);
  const glowY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 60]);

  return (
    <section className="relative overflow-hidden pt-36 pb-24 sm:pt-44">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -top-40 left-1/2 h-130 w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(192,132,252,0.28),transparent)] blur-2xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              <Sparkles className="size-3.5 text-accent" />
              v0.4.1 alpha is out — read the release notes
            </a>
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl"
          >
            Build a resume that{" "}
            <em className="bg-gradient-to-r from-accent to-accent-soft bg-clip-text font-display text-transparent not-italic sm:italic">
              actually
            </em>{" "}
            gets read.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            Stack draggable blocks, style them with hand-tuned themes and any
            Google Font, and export a pixel-perfect PDF or Word file. What you
            see on the page is exactly what recruiters get.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href={APP_URL}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-soft px-5 py-3 font-medium text-background transition-transform hover:scale-[1.03] active:scale-100"
            >
              Start building — it&apos;s free
              <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/5 px-5 py-3 font-medium transition-colors hover:bg-white/10"
            >
              Read the docs
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ y: mockupY }}
          className="relative hidden lg:block"
        >
          <AnimatedResumeMockup />
        </motion.div>
      </div>
    </section>
  );
}
