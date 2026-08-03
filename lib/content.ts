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
}

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
