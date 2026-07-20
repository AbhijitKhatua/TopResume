"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronDown, GripVertical, Plus, Printer, Trash2 } from "lucide-react";

/**
 * A miniature of the actual builder UI, demoing itself on a loop: dark editor
 * panel on the left where block cards lift, get dragged into a new order,
 * "type" fresh content and flip to half width — while the white A4 preview on
 * the right mirrors every change live, exactly like the real app. Under
 * prefers-reduced-motion it renders as a static screenshot-style mock.
 */

type BlockId = "experience" | "skills" | "education";

interface BlockSpec {
  id: BlockId;
  title: string;
  /** Skeleton line widths (percent). */
  lines: number[];
}

const BLOCKS: BlockSpec[] = [
  { id: "experience", title: "Work Experience", lines: [88, 72] },
  { id: "skills", title: "Skills", lines: [58] },
  { id: "education", title: "Education", lines: [76] },
];

const INITIAL_ORDER: BlockId[] = ["experience", "skills", "education"];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const springy = { type: "spring" as const, stiffness: 320, damping: 32 };

function GrowLine({ width, tone, delay = 0 }: { width: number; tone: string; delay?: number }) {
  return (
    <motion.div
      className={`rounded-full ${tone}`}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: `${width}%`, opacity: 1 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    />
  );
}

/** One dark block card, styled after the app's Blocks tab. */
function EditorBlock({
  spec,
  active,
  half,
  extraLines,
}: {
  spec: BlockSpec;
  active: boolean;
  half: boolean;
  extraLines: number;
}) {
  return (
    <motion.div
      layout
      transition={springy}
      animate={{
        scale: active ? 1.04 : 1,
        boxShadow: active ? "0 12px 32px -8px rgba(192,132,252,0.35)" : "0 0 0 rgba(0,0,0,0)",
      }}
      className={`rounded-lg border p-2 w-full ${ active ? "z-10 border-fuchsia-400/50 bg-white/[0.07]" : "border-white/10 bg-white/[0.04]"}`}>
      <div className="flex items-center gap-1">
        <GripVertical className={`size-3 shrink-0 ${active ? "text-fuchsia-300" : "text-zinc-600"}`} />
        <ChevronDown className="size-3 shrink-0 text-zinc-600" />
        <span className="truncate text-[10px] font-medium text-zinc-200">{spec.title}</span>
        <span className="ml-auto flex shrink-0 overflow-hidden rounded border border-white/10 text-[8px]">
          <span className={half ? "px-1 py-px text-zinc-500" : "bg-white/15 px-1 py-px text-zinc-100"}>Full</span>
          <span className={half ? "bg-white/15 px-1 py-px text-zinc-100" : "px-1 py-px text-zinc-500"}>Half</span>
        </span>
        <Trash2 className="size-3 shrink-0 text-zinc-600" />
      </div>
      <div className="mt-1.5 space-y-1 pl-4">
        {spec.lines.map((width, i) => (
          <div key={i} className="h-1 rounded-full bg-white/15" style={{ width: `${width}%` }} />
        ))}
        {Array.from({ length: extraLines }).map((_, i) => (
          <GrowLine key={`extra-${i}`} width={i % 2 === 0 ? 84 : 64} tone="h-1 bg-white/15" />
        ))}
      </div>
    </motion.div>
  );
}

/** The matching section on the white A4 preview page. */
function PreviewSection({
  spec,
  half,
  extraLines,
}: {
  spec: BlockSpec;
  half: boolean;
  extraLines: number;
}) {
  return (
    <motion.div layout transition={springy} className="w-full">
      <div className="mb-1 h-[5px] w-12 rounded-full bg-fuchsia-600/80" />
      <div className="space-y-1">
        {spec.lines.map((width, i) => (
          <div key={i} className="h-[3px] rounded-full bg-zinc-300" style={{ width: `${width}%` }} />
        ))}
        {Array.from({ length: extraLines }).map((_, i) => (
          <GrowLine key={`extra-${i}`} width={i % 2 === 0 ? 90 : 68} tone="h-[3px] bg-zinc-300" />
        ))}
      </div>
    </motion.div>
  );
}

export function AnimatedResumeMockup() {
  const reduceMotion = useReducedMotion();
  const [order, setOrder] = useState<BlockId[]>(INITIAL_ORDER);
  const [activeId, setActiveId] = useState<BlockId | null>(null);
  const [split, setSplit] = useState(false);
  const [extraLines, setExtraLines] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    let alive = true;

    (async () => {
      // Let the hero entrance settle before the show starts.
      await sleep(2200);

      while (alive) {
        // 1. Pick up "Skills" and drag it above "Work Experience".
        setActiveId("skills");
        await sleep(500);
        if (!alive) break;
        setOrder(["skills", "experience", "education"]);
        await sleep(700);
        setActiveId(null);
        await sleep(1600);
        if (!alive) break;

        // 2. Type two new lines into Work Experience.
        setExtraLines(1);
        await sleep(500);
        setExtraLines(2);
        await sleep(2000);
        if (!alive) break;

        // 3. Snap Skills + Education to half width, side by side…
        setSplit(true);
        await sleep(2400);
        if (!alive) break;

        // …and back to the full-width stack.
        setSplit(false);
        await sleep(1600);
        if (!alive) break;

        // 4. Tidy up: drag Skills home and clear the typed lines.
        setActiveId("skills");
        await sleep(500);
        setOrder(INITIAL_ORDER);
        await sleep(700);
        setActiveId(null);
        setExtraLines(0);
        await sleep(2200);
      }
    })();

    return () => {
      alive = false;
    };
  }, [reduceMotion]);

  const blocks = order
    .map((id) => BLOCKS.find((b) => b.id === id))
    .filter((b): b is BlockSpec => Boolean(b));

  const isHalf = (id: BlockId) => split && id !== "experience";

  return (
    <div className="relative mx-auto w-full max-w-135 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b11] shadow-[0_40px_120px_-20px_rgba(192,132,252,0.35)]">
      {/* Window top bar */}
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="ml-3 text-[10px] font-medium text-zinc-400">Top Resume</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[9px] font-medium text-zinc-900">
          <Printer className="size-2.5" />
          Download PDF
        </span>
      </div>

      <div className="grid grid-cols-[1.05fr_0.95fr]">
        {/* Editor panel — the Blocks tab */}
        <div className="border-r border-white/10 p-3">
          <div className="flex gap-1 text-[9px]">
            <span className="px-2 py-1 text-zinc-500">Personal</span>
            <span className="rounded-md bg-white/10 px-2 py-1 font-medium text-zinc-100">Blocks</span>
            <span className="px-2 py-1 text-zinc-500">Style</span>
          </div>

          <div className="mt-2.5 flex flex-wrap content-start gap-2">
            {blocks.map((spec) => (
              <EditorBlock
                key={spec.id}
                spec={spec}
                active={activeId === spec.id}
                half={isHalf(spec.id)}
                extraLines={spec.id === "experience" ? extraLines : 0}
              />
            ))}
          </div>

          <div className="mt-2.5 inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[9px] text-zinc-400">
            <Plus className="size-2.5" />
            Add section
          </div>
        </div>

        {/* Live A4 preview */}
        <div className="bg-black/30 p-3.5">
          <div className="overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {/* Creative Gradient theme header */}
            <div className="flex items-center gap-2 bg-linear-to-br from-fuchsia-200 via-violet-100 to-blue-100 px-3 py-3">
              <div className="size-6 rounded-full bg-linear-to-br from-fuchsia-400 to-violet-400" />
              <div className="space-y-1">
                <div className="h-1.5 w-20 rounded-full bg-zinc-800" />
                <div className="h-[3px] w-14 rounded-full bg-fuchsia-500/70" />
              </div>
            </div>
            <div className="flex min-h-44 flex-wrap content-start gap-1.5 px-3 py-3">
              {blocks.map((spec) => (
                <PreviewSection
                  key={spec.id}
                  spec={spec}
                  half={isHalf(spec.id)}
                  extraLines={spec.id === "experience" ? extraLines : 0}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
