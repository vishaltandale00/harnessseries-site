import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Harness Series",
    template: "%s | Harness Series",
  },
  description:
    "A research journal about the software layer that turns model intelligence into product behavior — harnesses, agents, traces, memory, retrieval, and the systems around models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="site-mark" href="/">
            <span className="site-mark-glyph" aria-hidden="true">
              §
            </span>
            <span className="site-mark-text">Harness Series</span>
          </Link>
          <p className="site-tagline">
            The software layer around model intelligence
          </p>
        </header>
        {children}
      </body>
    </html>
  );
}
