import RevealLines from "@/components/RevealLines";
import { content } from "@/lib/content";

/** Almost empty. One sentence, three quiet links. */
export default function Contact() {
  const { line, instagram, email, pdf } = content.contact;

  return (
    <footer
      id="contact"
      className="dark-section flex min-h-[90vh] scroll-mt-24 flex-col items-center justify-center bg-charcoal px-6 text-ivory"
    >
      <RevealLines
        as="h2"
        lines={line.split("\n")}
        className="font-serif-display max-w-4xl text-center text-4xl sm:text-5xl md:text-6xl"
      />

      <nav aria-label="Contact" className="mt-20 flex flex-wrap items-center justify-center gap-10">
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="eyebrow quiet-link">
          Instagram
        </a>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
        <a href={`mailto:${email}`} className="eyebrow quiet-link">
          Email
        </a>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
        <a href={pdf} target="_blank" rel="noopener noreferrer" className="eyebrow quiet-link">
          Portfolio&nbsp;PDF
        </a>
      </nav>

      <div className="mt-32 flex flex-col items-center gap-4 text-ivory/40">
        <p className="eyebrow">
          © {new Date().getFullYear()} {content.name}
        </p>
        <a
          href="https://www.kanishkkkk.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow quiet-link"
        >
          Made with ♥ by Z35TYYYY
        </a>
      </div>
    </footer>
  );
}
