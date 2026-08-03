import MaskImage from "@/components/MaskImage";
import RevealLines from "@/components/RevealLines";

interface StoryProps {
  image: string;
  alt: string;
  lines: string[];
  /** Flip the composition for alternating spreads. */
  reverse?: boolean;
}

/** A magazine spread: one large photograph, one headline, generous air. */
export default function Story({ image, alt, lines, reverse = false }: StoryProps) {
  return (
    <section className="px-6 py-28 sm:px-10 md:px-16 md:py-44">
      <div
        className={`mx-auto grid max-w-[1440px] items-center gap-14 md:grid-cols-12 md:gap-8 ${
          reverse ? "" : ""
        }`}
      >
        <div className={reverse ? "md:col-span-7 md:col-start-6 md:order-2" : "md:col-span-7"}>
          <div data-cursor className="media-hover">
            <MaskImage
              src={image}
              alt={alt}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="aspect-[4/5]"
            />
          </div>
        </div>
        <div
          className={
            reverse
              ? "md:col-span-4 md:col-start-1 md:order-1"
              : "md:col-span-4 md:col-start-9"
          }
        >
          <RevealLines
            as="h2"
            lines={lines}
            className="font-serif-display text-4xl sm:text-5xl md:text-6xl"
          />
        </div>
      </div>
    </section>
  );
}
