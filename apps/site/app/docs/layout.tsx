import type { Metadata } from "next";

import { DocsPager } from "@/components/docs/pager";
import { DocsSidebar } from "@/components/docs/sidebar";

export const metadata: Metadata = {
  title: "Docs",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* Mobile nav */}
        <details className="rounded-xl border border-line bg-white/[0.03] lg:hidden">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium">
            Docs navigation
          </summary>
          <div className="border-t border-line px-4 py-4">
            <DocsSidebar />
          </div>
        </details>

        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <DocsSidebar />
          </div>
        </aside>

        <div className="min-w-0">
          <article className="docs-prose">{children}</article>
          <DocsPager />
        </div>
      </div>
    </div>
  );
}
