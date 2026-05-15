import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EssayColophon } from "@/components/EssayColophon";
import { PretextArticle } from "@/components/PretextArticle";
import { ReferenceRail } from "@/components/ReferenceRail";
import { getPost, getPostSlugs, getPosts } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPosts();
  const related = post.relatedSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const dateShort = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${post.date}T00:00:00`));

  return (
    <main
      className="article-shell"
      style={{ ["--essay-accent" as string]: post.accent }}
    >
      <Link className="back-link" href="/">
        Harness Series &middot; Archive
      </Link>

      <article>
        <header className="article-header">
          <p className="department" data-issue={post.issue}>
            <span className="department-issue">{post.issue}</span>
            <span className="department-sep" aria-hidden="true">/</span>
            <span className="department-name">{post.department}</span>
            <span className="department-sep" aria-hidden="true">/</span>
            <time dateTime={post.date}>{dateShort}</time>
          </p>
          <h1 id="lede">{post.title}</h1>
          <p className="article-dek">{post.summary}</p>
          <p className="byline">
            <span className="byline-by">By</span>{" "}
            <span className="byline-name">{post.author.name}</span>
            {post.author.affiliation ? (
              <>
                {" "}
                <span className="byline-affil">
                  &middot; {post.author.affiliation}
                </span>
              </>
            ) : null}
          </p>
        </header>

        <div className="article-grid">
          <PretextArticle html={post.html} references={post.references} />
          <ReferenceRail
            references={post.references}
            citations={post.structure.citations}
          />
        </div>

        <EssayColophon post={post} related={related} />
      </article>
    </main>
  );
}
