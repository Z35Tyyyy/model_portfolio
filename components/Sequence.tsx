"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { content, type Still } from "@/lib/content";
import { getBlur } from "@/lib/blur";

/**
 * The closing sequence — the section pins while each frame dissolves over the
 * last, very slowly. Reduced motion sees the first frame, still.
 */
export default function Sequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const frames = content.sequence as Still[];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const imgs = section.querySelectorAll<HTMLElement>(".seq-frame");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${frames.length * 110}%`,
          scrub: 1.2,
          pin: true,
        },
      });
      imgs.forEach((img, i) => {
        if (i === 0) return;
        tl.fromTo(img, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: "none" }, i);
      });
      tl.to({}, { duration: 0.6 });
    });

    return () => mm.revert();
  }, [frames.length]);

  return (
    <section
      ref={sectionRef}
      aria-label="Closing image sequence"
      className="flex h-svh items-center justify-center overflow-hidden bg-ivory"
    >
      <div className="relative aspect-[4/5] h-[68vh] max-w-[88vw]">
        {frames.map((frame, i) => {
          const blur = getBlur(frame.image);
          return (
            <div
              key={frame.image}
              className={`seq-frame absolute inset-0 ${i === 0 ? "" : "opacity-0"}`}
            >
              <Image
                src={frame.image}
                alt={frame.alt}
                fill
                sizes="(min-width: 768px) 55vh, 88vw"
                className="object-cover"
                {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
