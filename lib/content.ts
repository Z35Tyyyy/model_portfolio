import site from "@/content/site.json";

export interface Project {
  name: string;
  category: string;
  campaign: string;
  year: string;
  description: string;
  image: string;
  alt: string;
  orientation?: "portrait" | "landscape";
  /** Crop bias for images whose subject sits high in the frame. */
  focus?: "top";
  /** Slug of a gallery in content.galleries this tile links to. */
  gallery?: string;
}

export interface GalleryItem {
  image: string;
  alt: string;
  orientation?: "portrait" | "landscape";
  focus?: "top";
}

export interface Gallery {
  title: string;
  blurb?: string;
  items: GalleryItem[];
}

export function getGallery(slug: string): Gallery | undefined {
  return (content.galleries as Record<string, Gallery>)[slug];
}

export const gallerySlugs = Object.keys(site.galleries);

export interface UgcItem {
  title: string;
  video: string;
  poster: string;
}

export interface Still {
  image: string;
  alt: string;
}

export const content = site;
export type SiteContent = typeof site;
