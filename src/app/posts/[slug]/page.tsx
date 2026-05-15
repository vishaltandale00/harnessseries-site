import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PretextArticle } from "@/components/PretextArticle";
import { ReferenceRail } from "@/components/ReferenceRail";
import { SystemDiagram } from "@/components/SystemDiagram";
import { getPost, getPostSlugs } from "@/lib/posts";

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

  return (
    <main className="article-shell">
      <Link className="back-link" href="/">
        Archive
      </Link>

      <article>
        <header className="article-header">
          <p className="eyebrow">Harness Series</p>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <time dateTime={post.date}>
              {new Intl.DateTimeFormat("en", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(`${post.date}T00:00:00`))}
            </time>
            <span>{post.draftPath}</span>
          </div>
          <div className="topic-row">
            {post.topics.map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
          </div>
        </header>

        <SystemDiagram variant={post.diagram} />

        <div className="article-grid">
          <PretextArticle html={post.html} />
          <ReferenceRail references={post.references} />
        </div>
      </article>
    </main>
  );
}
