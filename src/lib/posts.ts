import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

export type PostReference = {
  label: string;
  href: string;
  kind: "paper" | "essay" | "demo" | "source";
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  topics: string[];
  diagram: "meta-harness" | "dynamic-interface";
  draftPath: string;
  htmlPath: string;
  htmlFile: string;
  references: PostReference[];
  html: string;
};

type PostMeta = Omit<Post, "html">;

const contentRoot = path.join(process.cwd(), "content");

const postMetadata: PostMeta[] = [
  {
    slug: "autonomous-harness-engineering",
    title: "Autonomous Harness Engineering?",
    date: "2026-05-14",
    summary:
      "A field note on Meta-Harness, coding agents, and why the harness around a model may become as important as the model itself.",
    topics: ["Meta-Harness", "Coding Agents", "Traces", "Model Scaffolds"],
    diagram: "meta-harness",
    draftPath: "content/drafts/autonomous-harness-engineering.md",
    htmlPath: "content/posts/autonomous-harness-engineering.html",
    htmlFile: "autonomous-harness-engineering.html",
    references: [
      {
        label: "Meta-Harness paper",
        href: "https://arxiv.org/abs/2603.28052",
        kind: "paper",
      },
    ],
  },
  {
    slug: "harnesses-as-self-improving-infrastructure",
    title: "Harnesses as Self-Improving Infrastructure",
    date: "2026-05-14",
    summary:
      "A raw draft connecting agent harnesses to older recommendation infrastructure and the next step toward adaptive, per-user interfaces.",
    topics: ["Infrastructure", "Recommendation Systems", "Personalization", "Relayer"],
    diagram: "dynamic-interface",
    draftPath: "content/drafts/harnesses-as-self-improving-infrastructure.md",
    htmlPath: "content/posts/harnesses-as-self-improving-infrastructure.html",
    htmlFile: "harnesses-as-self-improving-infrastructure.html",
    references: [
      {
        label: "Meta-Harness paper",
        href: "https://arxiv.org/abs/2603.28052",
        kind: "paper",
      },
      {
        label: "The anatomy of an agent harness",
        href: "https://www.langchain.com/blog/the-anatomy-of-an-agent-harness#:~:text=TLDR%3A%20Agent%20%3D%20Model%20%2B,today%27s%20and%20tomorrow%27s%20agents%20need",
        kind: "essay",
      },
      {
        label: "Google ranking systems reference",
        href: "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf",
        kind: "paper",
      },
      {
        label: "LinkedIn feed engineering",
        href: "https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed#:~:text=One%20of%20our%20most%20important,such%20to%20any%20given%20member",
        kind: "essay",
      },
      {
        label: "DocLayer mock",
        href: "https://doclayer-one.vercel.app/mocks/",
        kind: "demo",
      },
      {
        label: "Meta IDE workspace mock",
        href: "https://meta-ide-workspace-mocks-20260513.vercel.app/",
        kind: "demo",
      },
    ],
  },
];

async function loadPost(meta: PostMeta): Promise<Post> {
  const html = await fs.readFile(
    path.join(process.cwd(), "content", "posts", meta.htmlFile),
    "utf8",
  );

  return {
    ...meta,
    html,
  };
}

export const getPosts = cache(async () => {
  const posts = await Promise.all(postMetadata.map(loadPost));

  return posts.sort(
    (first, second) =>
      new Date(second.date).getTime() - new Date(first.date).getTime(),
  );
});

export const getPost = cache(async (slug: string) => {
  const meta = postMetadata.find((post) => post.slug === slug);

  if (!meta) {
    return null;
  }

  return loadPost(meta);
});

export function getPostSlugs() {
  return postMetadata.map((post) => post.slug);
}

export function getDraftAbsolutePath(post: Pick<Post, "draftPath">) {
  return path.join(contentRoot, post.draftPath.replace(/^content\//, ""));
}
