"use client";

import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealLinesProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Seconds to hold before the first line rises. */
  delay?: number;
}

/** Typography that reveals line by line — each line rises out of an overflow mask. */
export default function RevealLines({
  lines,
  as = "p",
  className = "",
  delay = 0,
}: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inners = el.querySelectorAll<HTMLElement>(".line-inner");
    gsap.set(inners, { yPercent: 110 });

    const tween = gsap.to(inners, {
      yPercent: 0,
      duration: 1.4,
      delay,
      ease: "power4.out",
      stagger: 0.14,
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, lines]);

  return createElement(
    as,
    { ref, className, "aria-label": lines.join(" ") },
    lines.map((line, i) => (
      <span key={i} className="line-shell" aria-hidden="true">
        <span className="line-inner">{line}</span>
      </span>
    ))
  );
}
