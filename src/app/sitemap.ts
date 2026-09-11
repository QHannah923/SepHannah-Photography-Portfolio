import type { MetadataRoute } from "next";
import { siteUrl, collections } from "@/lib/studio";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/collections",
    ...collections.map((c) => "/collections/" + c.slug),
    "/styles",
    "/pricing",
    "/availability",
    "/about",
    "/makeup",
    "/scene-styling",
    "/inquire",
    "/privacy",
  ].map((path) => ({
    url: siteUrl + path,
    changeFrequency: path === "/availability" ? "daily" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/collections/") ? 0.9 : 0.7,
  }));
}
