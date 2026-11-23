import type { Metadata } from "next";
import Link from "next/link";
import { studio } from "@/lib/studio";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      "https://sep-hannah-photography-portfolio-qt.vercel.app",
  ),
  title: {
    default: "Brisbane Wedding & Portrait Photographer | SepHannah Studio",
    template: "%s | SepHannah Studio",
  },
  description:
    "Brisbane wedding, graduation, registry and portrait photography by Hannah. Explore the collections, photography packages and available dates.",
  openGraph: { type: "website", locale: "en_AU", siteName: "SepHannah Studio" },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-top">
            <Link className="wordmark" href="/">
              SepHannah<span>PHOTOGRAPHY STUDIO · BRISBANE</span>
            </Link>
            <div className="footer-links">
              <a
                href={studio.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram · {studio.instagramHandle} ↗
              </a>
              <Link href="/inquire">WeChat / Contact ↗</Link>
              <a href="mailto:qhanna000@gmail.com">Email Hannah ↗</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} SepHannah Studio. All photographs
              reserved.
            </span>
            <Link href="/booking-status">My requests</Link>
            <Link href="/#questions">Q&A</Link>
            <Link href="/#client-stories">Client stories</Link>
            <Link href="/privacy">Privacy</Link>
            <span>Real people. Beautifully remembered.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
