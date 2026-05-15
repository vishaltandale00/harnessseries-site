import Link from "next/link";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="home-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <p className="hero-issue">
          <span>Vol. I</span>
          <span aria-hidden="true">/</span>
          <span>2026</span>
          <span aria-hidden="true">/</span>
          <span>Edited by Vishal Tandale</span>
        </p>
        <h1 id="home-title">Harness Series</h1>
        <p className="home-thesis">
          A harness is not a wrapper. It is the product surface, runtime,
          memory, retrieval policy, trace system, and quality function wrapped
          around model intelligence. This is a journal about that layer.
        </p>
        <p className="home-dek">
          Field notes and long reads on the software around language models
          &mdash; what gets stored, retrieved, shown, traced, judged, and
          improved. Drafts kept in the open; voice preserved, structure edited.
        </p>
      </section>

      <section className="index-section" aria-labelledby="archive-title">
        <aside className="archive-rubric" aria-hidden="true">
          <p className="archive-rubric-line">Issue No. {posts[0]?.issue ?? "I.01"}</p>
          <p className="archive-rubric-line">
            {posts.length} essay{posts.length === 1 ? "" : "s"}
          </p>
          <p className="archive-rubric-line">
            {posts.reduce((s, p) => s + p.wordCount, 0).toLocaleString()} words
          </p>
          <p className="archive-rubric-line">
            ISSN&nbsp;0000&ndash;0000
          </p>
        </aside>

        <div className="archive-body">
          <h2 id="archive-title" className="archive-heading">
            The archive
          </h2>

          <ol className="post-index">
            {posts.map((post) => (
              <li
                key={post.slug}
                style={{ ["--essay-accent" as string]: post.accent }}
              >
                <Link href={`/posts/${post.slug}`}>
                  <span className="post-number">{post.issue}</span>
                  <span className="post-copy">
                    <span className="post-meta">
                      <span className="post-department">{post.department}</span>
                      <span aria-hidden="true">&middot;</span>
                      <time dateTime={post.date}>
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(`${post.date}T00:00:00`))}
                      </time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{post.wordCount.toLocaleString()} words</span>
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
        </div>
      </section>
    </main>
  );
}
