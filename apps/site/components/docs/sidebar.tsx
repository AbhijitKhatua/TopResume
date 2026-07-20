"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DOCS_NAV } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-7">
      {DOCS_NAV.map((group) => (
        <div key={group.heading}>
          <h3 className="text-xs font-semibold tracking-widest text-muted uppercase">
            {group.heading}
          </h3>
          <ul className="mt-2.5 space-y-0.5 border-l border-line">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors",
                      active
                        ? "border-accent font-medium text-foreground"
                        : "border-transparent text-muted hover:border-white/25 hover:text-foreground",
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
