import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="section closing">
      <p className="eyebrow">404 / A LITTLE OFF THE PATH</p>
      <h1>Let’s find your way back.</h1>
      <p>
        This page is no longer here, but there are more stories to discover.
      </p>
      <Link className="button" href="/collections">
        Explore the collections ↗
      </Link>
    </main>
  );
}
