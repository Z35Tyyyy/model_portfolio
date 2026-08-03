"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { getBlur } from "@/lib/blur";

interface MaskImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Subtle scroll parallax on the image inside its mask. */
  parallax?: boolean;
}

/** Image that reveals through a mask on scroll, settling from a gentle overscale. */
export default function MaskImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  parallax = true,
}: MaskImageProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shell,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.6,
          ease: "power3.inOut",
          scrollTrigger: { trigger: shell, start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        inner,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: shell, start: "top 85%", once: true },
        }
      );
      if (parallax) {
        gsap.fromTo(
          inner,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: shell,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, shell);

    return () => ctx.revert();
  }, [parallax]);

  const blur = getBlur(src);

  return (
    <div ref={shellRef} className={`mask-shell relative ${className}`}>
      <div ref={innerRef} className="absolute -inset-[5%] will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
        />
      </div>
    </div>
  );
}
