"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { content, type UgcItem } from "@/lib/content";
import { getBlur } from "@/lib/blur";

/**
 * UGC as an editorial film strip on charcoal. Hover plays silently; click opens
 * fullscreen. Items without a video yet stay as quiet poster placeholders.
 */
export default function Ugc() {
  const items = content.ugc.items as UgcItem[];
  const [open, setOpen] = useState<UgcItem | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <section
      id="films"
      className="dark-section scroll-mt-24 bg-charcoal py-32 text-ivory md:py-48"
    >
      <header className="px-6 sm:px-10 md:px-16">
        <p className="eyebrow mb-6 text-ivory/50">{content.ugc.heading}</p>
        <h2 className="font-serif-display max-w-3xl text-5xl sm:text-6xl md:text-7xl">
          {content.ugc.subheading}
        </h2>
      </header>

      <ul
        className="mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-10 md:mt-28 md:gap-10 md:px-16"
        aria-label="UGC films"
      >
        {items.map((item, i) => (
          <li key={item.title} className="w-[72vw] flex-none snap-start sm:w-[40vw] lg:w-[23vw]">
            <StripItem item={item} index={i} onOpen={() => item.video && setOpen(item)} />
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} — fullscreen`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-[180] flex items-center justify-center bg-black/95 p-6"
            onClick={close}
          >
            <button
              ref={closeRef}
              onClick={close}
              className="eyebrow quiet-link absolute right-8 top-8 text-ivory"
            >
              Close
            </button>
            <video
              src={open.video}
              poster={open.poster}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] max-w-full"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StripItem({
  item,
  index,
  onOpen,
}: {
  item: UgcItem;
  index: number;
  onOpen: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const blur = getBlur(item.poster);
  const hasVideo = Boolean(item.video);

  const play = () => videoRef.current?.play().catch(() => undefined);
  const pause = () => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <figure>
      <button
        type="button"
        data-cursor
        onClick={onOpen}
        onMouseEnter={hasVideo ? play : undefined}
        onMouseLeave={hasVideo ? pause : undefined}
        onFocus={hasVideo ? play : undefined}
        onBlur={hasVideo ? pause : undefined}
        aria-label={hasVideo ? `Play ${item.title} fullscreen` : `${item.title} — coming soon`}
        className="media-hover relative block aspect-[9/16] w-full overflow-hidden"
        disabled={!hasVideo}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={item.poster}
            alt={`${item.title} placeholder`}
            fill
            sizes="(min-width: 1024px) 23vw, 72vw"
            className="object-cover"
            {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
          />
        )}
      </button>
      <figcaption className="eyebrow mt-5 flex items-baseline justify-between text-ivory/60">
        <span>{item.title}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </figcaption>
    </figure>
  );
}
