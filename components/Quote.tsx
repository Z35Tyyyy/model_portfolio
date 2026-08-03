import RevealLines from "@/components/RevealLines";

interface QuoteProps {
  text: string;
  theme?: "light" | "dark";
}

/** An editorial aside — a gold hairline and one italic sentence. */
export default function Quote({ text, theme = "light" }: QuoteProps) {
  const dark = theme === "dark";
  return (
    <section
      className={`flex flex-col items-center px-6 py-24 md:py-48 ${
        dark ? "dark-section bg-charcoal text-ivory" : "bg-ivory text-charcoal"
      }`}
    >
      <span aria-hidden="true" className="mb-12 h-px w-10 bg-gold" />
      <RevealLines
        as="blockquote"
        lines={[text]}
        className="font-serif-display max-w-4xl text-center text-3xl italic sm:text-4xl md:text-5xl"
      />
    </section>
  );
}
