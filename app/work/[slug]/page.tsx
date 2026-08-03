import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MaskImage from "@/components/MaskImage";
import { content, gallerySlugs, getGallery } from "@/lib/content";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return gallerySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = getGallery(slug);
  if (!gallery) return {};
  return {
    title: `${gallery.title} — ${content.name}`,
    description: gallery.blurb,
  };
}

/** A category gallery — the same magazine rhythm, one photograph at a time. */
export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  const gallery = getGallery(slug);
  if (!gallery) notFound();

  return (
    <article className="px-6 pb-40 pt-36 sm:px-10 md:px-16 md:pt-48">
      <header className="mx-auto max-w-[1440px]">
        <Link href="/#projects" className="eyebrow quiet-link text-smoke">
          ← {content.name}
        </Link>
        <h1 className="font-serif-display mt-10 text-6xl sm:text-7xl md:text-8xl">
          {gallery.title}
        </h1>
        {gallery.blurb && (
          <p className="font-serif-display mt-6 max-w-xl text-xl italic text-smoke sm:text-2xl">
            {gallery.blurb}
          </p>
        )}
        <p className="eyebrow mt-8 text-smoke">
          {gallery.items.length} frames
        </p>
      </header>

      <div className="mx-auto mt-24 max-w-[1440px] space-y-24 md:mt-36 md:space-y-44">
        {gallery.items.map((item, i) => {
          const landscape = item.orientation === "landscape";
          const placement = landscape
            ? "w-full max-w-[1200px] mx-auto"
            : i % 4 === 0
              ? "mx-auto w-full max-w-[560px] md:w-[60vh] md:max-w-none"
              : i % 4 === 1
                ? "w-[82vw] max-w-[440px] md:w-[46vh] md:max-w-none ml-auto md:mr-[6vw]"
                : i % 4 === 2
                  ? "w-[82vw] max-w-[440px] md:w-[46vh] md:max-w-none mr-auto md:ml-[6vw]"
                  : "mx-auto w-full max-w-[560px] md:w-[54vh] md:max-w-none";
          return (
            <div key={item.image} data-cursor className={`media-hover ${placement}`}>
              <MaskImage
                src={item.image}
                alt={item.alt}
                sizes={landscape ? "(min-width: 768px) 80vw, 100vw" : "(min-width: 768px) 60vh, 88vw"}
                className={landscape ? "aspect-[16/10]" : "aspect-[4/5]"}
                focus={item.focus}
              />
            </div>
          );
        })}
      </div>

      <footer className="mt-32 text-center md:mt-44">
        <Link href="/#projects" className="eyebrow quiet-link text-smoke">
          Back to all work
        </Link>
      </footer>
    </article>
  );
}
