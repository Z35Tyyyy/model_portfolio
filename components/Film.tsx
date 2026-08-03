import Image from "next/image";
import MaskImage from "@/components/MaskImage";
import { content, type Still } from "@/lib/content";
import { getBlur } from "@/lib/blur";

/**
 * Introduction film — one cinematic frame, three supporting stills.
 * Until the client's film arrives, the poster holds the frame untouched.
 */
export default function Film() {
  const film = content.film;
  const stills = film.stills as Still[];
  const blur = getBlur(film.poster);

  return (
    <section aria-label="Introduction film" className="px-6 py-32 sm:px-10 md:px-16 md:py-52">
      <div className="mx-auto max-w-[1600px]">
        <p className="eyebrow mb-6 text-smoke">{film.heading}</p>
        <h2 className="font-serif-display mb-20 text-5xl sm:text-6xl md:mb-28 md:text-7xl">
          A short film
        </h2>

        <div data-cursor className="media-hover relative aspect-video overflow-hidden bg-charcoal">
          {film.video ? (
            <video
              src={film.video}
              poster={film.poster}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={film.poster}
              alt="Introduction film placeholder"
              fill
              sizes="(min-width: 768px) 92vw, 100vw"
              className="object-cover"
              {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
            />
          )}
        </div>

        <div className="mt-24 grid gap-10 sm:grid-cols-3 md:mt-36 md:gap-8">
          {stills.map((still, i) => (
            <div
              key={still.image}
              data-cursor
              className={`media-hover ${i === 1 ? "sm:mt-16" : ""} ${i === 2 ? "sm:mt-32" : ""}`}
            >
              <MaskImage
                src={still.image}
                alt={still.alt}
                sizes="(min-width: 640px) 30vw, 100vw"
                className="aspect-[4/5]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
