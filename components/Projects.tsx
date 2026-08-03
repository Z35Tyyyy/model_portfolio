import Link from "next/link";
import MaskImage from "@/components/MaskImage";
import { content, type Project } from "@/lib/content";

/** Fullscreen gallery — each project owns the viewport; hover breathes the caption in. */
export default function Projects() {
  const projects = content.projects as Project[];

  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-24 py-24 md:py-40">
      <header className="px-6 pb-20 sm:px-10 md:px-16 md:pb-32">
        <p className="eyebrow mb-6 text-smoke">Selected Work</p>
        <h2 className="font-serif-display text-5xl sm:text-6xl md:text-7xl">Projects</h2>
      </header>

      <ul className="space-y-28 md:space-y-44">
        {projects.map((project, i) => {
          const landscape = project.orientation === "landscape";
          const figure = (
            <figure
              data-cursor
              className={`group media-hover relative mx-auto ${
                landscape
                  ? "w-[92vw] max-w-[1600px]"
                  : "w-[88vw] max-w-[560px] md:w-[62vh] md:max-w-none"
              }`}
            >
              <MaskImage
                src={project.image}
                alt={project.alt}
                sizes={landscape ? "92vw" : "(min-width: 768px) 62vh, 88vw"}
                className={landscape ? "aspect-[16/10]" : "aspect-[4/5]"}
                focus={project.focus}
              />
              <figcaption
                className="pointer-events-none absolute bottom-0 left-0 z-10 p-8 text-ivory transition-all duration-700 ease-out md:translate-y-2 md:p-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100"
                style={{ textShadow: "0 1px 24px rgba(0,0,0,0.35)" }}
              >
                <span className="eyebrow block text-ivory/70">
                  {String(i + 1).padStart(2, "0")} — {project.campaign}
                </span>
                <span className="font-serif-display mt-3 block text-4xl md:text-5xl">
                  {project.name}
                </span>
                <span className="eyebrow mt-4 block text-ivory/70">
                  {project.year}
                  {project.gallery && <span className="ml-6">View gallery —</span>}
                </span>
              </figcaption>
            </figure>
          );

          return (
            <li key={project.name}>
              {project.gallery ? (
                <Link
                  href={`/work/${project.gallery}`}
                  aria-label={`${project.name} — view gallery`}
                  className="block"
                >
                  {figure}
                </Link>
              ) : (
                figure
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
