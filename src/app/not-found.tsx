import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <p className="eyebrow">Missing page</p>
      <h1>This essay is not in the archive.</h1>
      <Link className="back-link" href="/">
        Return to Harness Series
      </Link>
    </main>
  );
}
