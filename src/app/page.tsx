import Link from "next/link";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="home-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-kicker">Research journal / field notes</div>
        <h1 id="home-title">Harness Series</h1>
        <p>
          Essays on the software layer that turns model intelligence into
          product behavior: what gets stored, retrieved, shown, traced, judged,
          and improved.
        </p>
      </section>

      <section className="index-section" aria-labelledby="archive-title">
        <div className="section-heading">
          <p className="eyebrow">Archive</p>
          <h2 id="archive-title">Current drafts</h2>
        </div>

        <ol className="post-index">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>
                <span className="post-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="post-copy">
                  <span className="post-meta">
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(`${post.date}T00:00:00`))}
                  </span>
                  <span className="post-title">{post.title}</span>
                  <span className="post-summary">{post.summary}</span>
                  <span className="topic-row">
                    {post.topics.map((topic) => (
                      <span key={topic}>{topic}</span>
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="thesis-band" aria-label="Publication thesis">
        <p>
          A harness is not a wrapper. It is the product surface, runtime,
          memory, retrieval policy, trace system, and quality function wrapped
          around model intelligence.
        </p>
      </section>
    </main>
  );
}
