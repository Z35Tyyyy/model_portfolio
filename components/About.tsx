"use client";

import { useEffect, useRef } from "react";
import MaskImage from "@/components/MaskImage";
import { gsap } from "@/lib/gsap";
import { content } from "@/lib/content";

/** One portrait. One paragraph. Nothing to prove. */
export default function About() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="about" className="scroll-mt-24 px-6 py-32 sm:px-10 md:px-16 md:py-52">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5 md:col-start-2">
          <div data-cursor className="media-hover">
            <MaskImage
              src={content.about.image}
              alt={content.about.alt}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/5]"
            />
          </div>
        </div>
        <div ref={textRef} className="self-center md:col-span-4 md:col-start-8">
          <p className="eyebrow mb-10 text-smoke">{content.about.heading}</p>
          <p className="font-serif-display text-2xl leading-[1.45] sm:text-3xl">
            {content.about.paragraph}
          </p>
          <dl className="mt-14 flex gap-16">
            {content.about.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="eyebrow text-smoke">{spec.label}</dt>
                <dd className="font-serif-display mt-3 text-3xl">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
