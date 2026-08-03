"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Lenis smooth scroll driven by GSAP's ticker, kept in sync with ScrollTrigger. */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchor navigation glides instead of jumping; cross-page
    // hash links (e.g. /#about from a gallery) navigate normally.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.('a[href*="#"]') as
        | HTMLAnchorElement
        | null;
      if (!anchor || !anchor.hash) return;
      const url = new URL(anchor.href);
      if (url.pathname !== window.location.pathname) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.6 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On route changes Lenis would otherwise keep its previous scroll position
  // and drag the new page back to it. This must be a LAYOUT effect: it has to
  // run before the incoming page's passive effects create their ScrollTriggers,
  // or every reveal computes against the stale offset and fires at once.
  useLayoutEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target) {
      lenis.scrollTo(target as HTMLElement, { immediate: true, force: true });
    } else {
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  // After the new page's triggers exist, recompute their positions once.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
