import { decorateArticleHtml } from "@/lib/posts";
import type { PostReference } from "@/lib/posts";

type ArticleReaderProps = {
  html: string;
  references: PostReference[];
};

export function PretextArticle({ html, references }: ArticleReaderProps) {
  const decorated = decorateArticleHtml(html, references);
  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: decorated }}
    />
  );
}
