import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";
import Progress from "@/components/Progress";
import { content } from "@/lib/content";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // Swap for the production domain before launch.
  metadataBase: new URL("https://palak.example.com"),
  title: content.seo.title,
  description: content.seo.description,
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    type: "website",
    images: [{ url: content.hero.image }],
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll />
        <Nav />
        <Progress />
        <Cursor />
        <main>{children}</main>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
