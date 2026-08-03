"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** A minimalist circle that appears only over media (elements marked data-cursor). */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const overMedia = (e.target as Element | null)?.closest?.("[data-cursor]");
      gsap.to(el, {
        autoAlpha: overMedia ? 1 : 0,
        scale: overMedia ? 1 : 0.4,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[160] -ml-4 -mt-4 h-8 w-8 rounded-full border border-ivory opacity-0 mix-blend-difference"
    />
  );
}
