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
    "A research-journal-style publication about harnesses, agents, traces, memory, retrieval, and software systems around models.",
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
            Harness Series
          </Link>
          <p>Systems around intelligence</p>
        </header>
        {children}
      </body>
    </html>
  );
}
