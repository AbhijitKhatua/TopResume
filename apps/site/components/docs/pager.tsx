"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { DOCS_FLAT } from "@/lib/docs";

export function DocsPager() {
  const pathname = usePathname();
  const index = DOCS_FLAT.findIndex((link) => link.href === pathname);
  if (index === -1) return null;

  const prev = DOCS_FLAT[index - 1];
  const next = DOCS_FLAT[index + 1];

  return (
    <div className="mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group rounded-xl border border-line p-4 transition-colors hover:border-accent/40"
        >
          <span className="flex items-center gap-1 text-xs text-muted">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next && (
        <Link
          href={next.href}
          className="group rounded-xl border border-line p-4 text-right transition-colors hover:border-accent/40"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted">
            Next
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      )}
    </div>
  );
}
