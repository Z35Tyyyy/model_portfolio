"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { content } from "@/lib/content";

/**
 * Opening: black screen, one sentence fades in, holds, fades away.
 * Plays once per session; skipped entirely for reduced motion.
 */
export default function Intro() {
  const [done, setDone] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("intro-seen")) return;

    sessionStorage.setItem("intro-seen", "1");
    setDone(false);
  }, []);

  useEffect(() => {
    if (done) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const lines = overlay.querySelectorAll<HTMLElement>(".intro-line");
    const tl = gsap.timeline({
      onComplete: () => {
        html.style.overflow = prevOverflow;
        setDone(true);
      },
    });

    tl.to({}, { duration: 0.9 })
      .fromTo(
        lines,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 1.5, ease: "power2.out", stagger: 0.5 }
      )
      .to({}, { duration: 1.3 })
      .to(lines, { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" })
      .to(overlay, { autoAlpha: 0, duration: 1, ease: "power2.inOut" }, "-=0.3");

    return () => {
      tl.kill();
      html.style.overflow = prevOverflow;
    };
  }, [done]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black px-8"
    >
      <p className="font-serif-display text-center text-2xl text-ivory/90 italic sm:text-3xl md:text-4xl">
        {content.opening.map((line, i) => (
          <span key={i} className="intro-line block opacity-0 leading-snug">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
