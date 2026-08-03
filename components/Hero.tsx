"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { content } from "@/lib/content";
import { getBlur } from "@/lib/blur";

/** Full-screen portrait with an almost invisible mouse parallax. */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(image, "x", { duration: 1.4, ease: "power3.out" });
    const yTo = gsap.quickTo(image, "y", { duration: 1.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo(nx * -14);
      yTo(ny * -10);
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  const blur = getBlur(content.hero.image);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label={`${content.name} — ${content.roles.join(", ")}`}
      className="relative h-svh overflow-hidden"
    >
      <div ref={imageRef} className="absolute -inset-[2%] will-change-transform">
        <Image
          src={content.hero.image}
          alt={content.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%]"
          {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-14 text-ivory mix-blend-difference">
        <h1 className="font-serif-display text-6xl tracking-[0.18em] sm:text-7xl md:text-8xl">
          {content.name}
        </h1>
        <p className="eyebrow mt-6 flex items-center gap-4 text-ivory/80">
          {content.roles.map((role, i) => (
            <span key={role} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-current opacity-50" />}
              {role}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
