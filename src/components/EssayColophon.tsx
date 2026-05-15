import Link from "next/link";
import type { Post } from "@/lib/posts";

type EssayColophonProps = {
  post: Post;
  related: Post[];
};

function bibtex(post: Post): string {
  const year = post.date.slice(0, 4);
  const id = `harness${year}-${post.slug.split("-")[0]}`;
  const authors = post.author.name;
  const title = post.title.replace(/&/g, "\\&");
  return `@article{${id},
  author  = {${authors}},
  title   = {${title}},
  journal = {Harness Series},
  number  = {${post.issue}},
  year    = {${year}},
  url     = {https://harnessseries.com/posts/${post.slug}}
}`;
}

export function EssayColophon({ post, related }: EssayColophonProps) {
  const dateLong = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${post.date}T00:00:00`));

  return (
    <footer className="essay-colophon" aria-label="Colophon">
      <div className="endmark">
        <span className="endmark-rule" aria-hidden="true">&mdash;</span>
        <span className="endmark-name">{post.author.name}</span>
      </div>

      <dl className="colophon-meta">
        <div>
          <dt>Published</dt>
          <dd>
            <time dateTime={post.date}>{dateLong}</time>
          </dd>
        </div>
        <div>
          <dt>Issue</dt>
          <dd>
            Harness Series &middot; {post.issue}
          </dd>
        </div>
        <div>
          <dt>Length</dt>
          <dd>
            {post.wordCount.toLocaleString()} words &middot;{" "}
            {post.readingMinutes} min
          </dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{post.department}</dd>
        </div>
        {post.author.affiliation ? (
          <div>
            <dt>Affiliation</dt>
            <dd>{post.author.affiliation}</dd>
          </div>
        ) : null}
        {post.thanks && post.thanks.length ? (
          <div>
            <dt>Thanks</dt>
            <dd>
              {post.thanks.join(", ")} &mdash; for reading drafts.
            </dd>
          </div>
        ) : null}
      </dl>

      <details className="colophon-cite">
        <summary>
          <span className="colophon-cite-summary">How to cite</span>
        </summary>
        <pre>{bibtex(post)}</pre>
      </details>

      {related.length ? (
        <section className="see-also" aria-labelledby="see-also-heading">
          <h2 className="eyebrow" id="see-also-heading">
            See also
          </h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/posts/${r.slug}`}>
                  <span className="see-also-issue">{r.issue}</span>
                  <span className="see-also-title">{r.title}</span>
                  <span className="see-also-summary">{r.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </footer>
  );
}
