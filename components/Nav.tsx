"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { content } from "@/lib/content";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Films", href: "#films" },
  { label: "Contact", href: "#contact" },
];

/** Hidden until the visitor scrolls past the hero; then a whisper of a nav. */
export default function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.55);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-[120] mix-blend-difference ${
        visible ? "" : "pointer-events-none"
      }`}
    >
      <nav
        aria-label="Primary"
        className="flex items-center justify-between px-6 py-6 text-ivory sm:px-10 md:px-16"
      >
        <a href="#top" className="eyebrow quiet-link py-2 tracking-[0.4em]">
          {content.name}
        </a>
        <ul className="flex items-center gap-5 sm:gap-10">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="eyebrow quiet-link inline-block py-2">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
