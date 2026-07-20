"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Buttery smooth wheel/touch scrolling via Lenis. Renders nothing; it only
 * attaches to the window. Disabled for users who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.12,
      // Intercept same-page anchor clicks so they glide instead of jumping.
      anchors: { offset: -96 },
    });

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
