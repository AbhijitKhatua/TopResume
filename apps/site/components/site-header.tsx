"use client";

import { motion, useScroll } from "motion/react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import logo from "@/app/logo-white.svg";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const APP_URL = "https://app.topresume.me";
const GITHUB_URL = "https://github.com/AbhijitKhatua/TopResume";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#themes", label: "Themes" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const { scrollYProgress } = useScroll();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Image src={logo} alt="logo" height={30} width={30} />
          Top Resume
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="hidden size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground sm:grid"
          >
            <GithubMark className="size-4.5" />
          </a>
          <a
            href={APP_URL}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background transition-transform hover:scale-[1.03] active:scale-100"
          >
            Open the builder
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Scroll progress hairline */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-gradient-to-r from-accent to-accent-soft"
      />
    </header>
  );
}
