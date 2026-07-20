"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fade-and-rise scroll reveal. Animates once as it enters the viewport and
 * respects prefers-reduced-motion.
 *
 * Safety net: if IntersectionObserver never fires (throttled tabs, exotic
 * embeds), a timeout forces the content visible — animation is progressive
 * enhancement, never a gate that can hide content forever.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setForced(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  const show = reduceMotion || inView || forced;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
