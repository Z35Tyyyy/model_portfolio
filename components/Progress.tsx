"use client";

import { useEffect, useRef } from "react";

/** Scroll progress as a hairline on the right edge. */
export default function Progress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        fill.style.transform = `scaleY(${p})`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed right-3 top-0 z-[110] hidden h-full w-px bg-ivory/20 mix-blend-difference md:block"
    >
      <div ref={fillRef} className="h-full w-full origin-top scale-y-0 bg-ivory" />
    </div>
  );
}
