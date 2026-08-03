import RevealLines from "@/components/RevealLines";

interface StatementProps {
  lines: string[];
  theme?: "light" | "dark";
}

/** Huge typography. One thought. Nothing else. */
export default function Statement({ lines, theme = "light" }: StatementProps) {
  const dark = theme === "dark";
  return (
    <section
      className={`flex min-h-[65vh] items-center justify-center px-6 py-28 md:min-h-[85vh] md:py-32 ${
        dark ? "dark-section bg-charcoal text-ivory" : "bg-ivory text-charcoal"
      }`}
    >
      <RevealLines
        as="h2"
        lines={lines}
        className="font-serif-display text-center text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
      />
    </section>
  );
}
