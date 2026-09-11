import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/studio";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/booking-status"],
    },
    sitemap: siteUrl + "/sitemap.xml",
  };
}
