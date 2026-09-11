import { NextResponse } from "next/server";
import {
  collections,
  styles,
  packages,
  photos,
  faqs,
  studio,
  siteUrl,
} from "@/lib/studio";
export function GET() {
  return NextResponse.json(
    {
      studio,
      collections,
      styles,
      packages,
      photos: photos.map((p) => ({ ...p, src: siteUrl + p.src })),
      faqs,
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
