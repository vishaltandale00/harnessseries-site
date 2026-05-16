import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

export type PostReference = {
  label: string;
  href: string;
  kind: "paper" | "essay" | "demo" | "source";
};

export type ArticleBlock =
  | {
      kind: "p" | "h2" | "h3";
      id: string;
      html: string;
      text: string;
      wordCount: number;
      citationIds: number[];
    }
  | {
      kind: "figure";
      id: string;
      figId: string;
      html: string;
    };

export type ArticleStructure = {
  blocks: ArticleBlock[];
  sections: {
    id: string;
    headingId: string | null;
    heading: string;
    blockCount: number;
    paragraphCount: number;
    wordCount: number;
    citationCount: number;
    figureCount: number;
    firstBlockIndex: number;
    blocks: ArticleBlock[];
  }[];
  citations: Record<number, { paragraphIds: string[] }>;
  figures: { figId: string; paragraphIdAfter: string | null }[];
  wordCount: number;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  topics: string[];
  draftPath: string;
  htmlPath: string;
  htmlFile: string;
  references: PostReference[];
  html: string;
  readingMinutes: number;
  wordCount: number;
  accent: string;
  author: { name: string; affiliation?: string };
  thanks?: string[];
  issue: string;
  department: string;
  relatedSlugs: string[];
  structure: ArticleStructure;
};

type PostMeta = Omit<
  Post,
  "html" | "readingMinutes" | "wordCount" | "structure"
>;

const contentRoot = path.join(process.cwd(), "content");

const postMetadata: PostMeta[] = [
  {
    slug: "harnesses-as-self-improving-infrastructure",
    title: "Harnesses as Self-Improving Infrastructure",
    date: "2026-05-12",
    summary:
      "Connecting agent harnesses to a decade of recommendation infrastructure, and the next step toward adaptive, per-user interfaces.",
    topics: ["infrastructure", "recommendation", "personalization"],
    draftPath: "content/drafts/harnesses-as-self-improving-infrastructure.md",
    htmlPath: "content/posts/harnesses-as-self-improving-infrastructure.html",
    htmlFile: "harnesses-as-self-improving-infrastructure.html",
    accent: "#2c4f63",
    author: { name: "Vishal Tandale", affiliation: "Founder, Relayerlabs.ai" },
    thanks: [],
    issue: "I.02",
    department: "Long Read",
    relatedSlugs: ["autonomous-harness-engineering"],
    references: [
      {
        label: "Meta-Harness: End-to-End Optimization of Model Harnesses, arXiv:2603.28052",
        href: "https://arxiv.org/abs/2603.28052",
        kind: "paper",
      },
      {
        label: "LangChain — The anatomy of an agent harness",
        href: "https://www.langchain.com/blog/the-anatomy-of-an-agent-harness",
        kind: "essay",
      },
      {
        label: "Google Research — Ranking systems reference",
        href: "https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf",
        kind: "paper",
      },
      {
        label: "LinkedIn Engineering — Engineering the next generation of LinkedIn's feed",
        href: "https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed",
        kind: "essay",
      },
      {
        label: "DocLayer — auto-improving harness prototype",
        href: "https://doclayer-one.vercel.app/mocks/",
        kind: "demo",
      },
      {
        label: "Meta IDE workspace — auto-improving harness prototype",
        href: "https://meta-ide-workspace-mocks-20260513.vercel.app/",
        kind: "demo",
      },
      {
        label: "OpenAI — Introducing GPT-5.3-Codex",
        href: "https://openai.com/index/introducing-gpt-5-3-codex/",
        kind: "source",
      },
    ],
  },
  {
    slug: "autonomous-harness-engineering",
    title: "Autonomous Harness Engineering?",
    date: "2026-05-14",
    summary:
      "A field note on the Meta-Harness paper, coding agents, and why the harness around a model may matter as much as the model itself.",
    topics: ["meta-harness", "coding agents", "traces"],
    draftPath: "content/drafts/autonomous-harness-engineering.md",
    htmlPath: "content/posts/autonomous-harness-engineering.html",
    htmlFile: "autonomous-harness-engineering.html",
    accent: "#8a2a1f",
    author: { name: "Akhil Ramaswamy" },
    thanks: [],
    issue: "I.01",
    department: "Field Notes",
    relatedSlugs: ["harnesses-as-self-improving-infrastructure"],
    references: [
      {
        label: "Meta-Harness: End-to-End Optimization of Model Harnesses, arXiv:2603.28052",
        href: "https://arxiv.org/abs/2603.28052",
        kind: "paper",
      },
    ],
  },
];

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function extractCitationIds(html: string): number[] {
  const ids: number[] = [];
  const re = /href="#ref-(\d+)"/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    ids.push(Number(match[1]));
  }
  return ids;
}

function parseArticle(html: string): ArticleStructure {
  // Remove section wrappers so the parser sees a flat sequence of blocks.
  const flat = html.replace(/<\/?section[^>]*>/g, "");

  // Walk top-level p / h2 / h3 / figure tags. The article HTML is hand-authored
  // and shallow, so a tag-aware regex is sufficient.
  const blockRe =
    /<(p|h2|h3|figure)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  const blocks: ArticleBlock[] = [];
  const citations: Record<number, { paragraphIds: string[] }> = {};
  const figures: ArticleStructure["figures"] = [];
  let pIdx = 0;
  let totalWords = 0;
  let lastParagraphId: string | null = null;

  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(flat)) !== null) {
    const tag = m[1] as "p" | "h2" | "h3" | "figure";
    const attrs = m[2] || "";
    const inner = m[3] || "";

    if (tag === "figure") {
      const figIdMatch = attrs.match(/id="([^"]+)"/);
      const figId = figIdMatch ? figIdMatch[1] : `fig-${blocks.length}`;
      blocks.push({
        kind: "figure",
        id: figId,
        figId,
        html: m[0],
      });
      figures.push({ figId, paragraphIdAfter: lastParagraphId });
    } else {
      pIdx += 1;
      const id = `b-${pIdx}`;
      const text = stripTags(inner);
      const wc = countWords(text);
      const citationIds = extractCitationIds(inner);
      blocks.push({
        kind: tag,
        id,
        html: inner,
        text,
        wordCount: wc,
        citationIds,
      });
      if (tag === "p") {
        lastParagraphId = id;
        for (const refNum of citationIds) {
          if (!citations[refNum]) citations[refNum] = { paragraphIds: [] };
          if (!citations[refNum].paragraphIds.includes(id)) {
            citations[refNum].paragraphIds.push(id);
          }
        }
      }
      totalWords += wc;
    }
  }

  // Build sections grouped by h2 boundaries.
  const sections: ArticleStructure["sections"] = [];
  let current: ArticleStructure["sections"][number] | null = null;
  blocks.forEach((b, idx) => {
    if (b.kind === "h2") {
      current = {
        id: `s-${sections.length + 1}`,
        headingId: b.id,
        heading: b.text,
        blockCount: 1,
        paragraphCount: 0,
        wordCount: b.wordCount,
        citationCount: 0,
        figureCount: 0,
        firstBlockIndex: idx,
        blocks: [b],
      };
      sections.push(current);
    } else {
      if (!current) {
        current = {
          id: `s-${sections.length + 1}`,
          headingId: null,
          heading: "Lede",
          blockCount: 0,
          paragraphCount: 0,
          wordCount: 0,
          citationCount: 0,
          figureCount: 0,
          firstBlockIndex: idx,
          blocks: [],
        };
        sections.push(current);
      }
      current.blocks.push(b);
      current.blockCount += 1;
      if (b.kind === "p") {
        current.paragraphCount += 1;
        current.wordCount += b.wordCount;
        current.citationCount += b.citationIds.length;
      } else if (b.kind === "figure") {
        current.figureCount += 1;
      } else if (b.kind === "h3") {
        current.wordCount += b.wordCount;
      }
    }
  });

  return {
    blocks,
    sections,
    citations,
    figures,
    wordCount: totalWords,
  };
}

async function loadPost(meta: PostMeta): Promise<Post> {
  const html = await fs.readFile(
    path.join(process.cwd(), "content", "posts", meta.htmlFile),
    "utf8",
  );
  const structure = parseArticle(html);
  const wordCount = structure.wordCount;
  const readingMinutes = Math.max(1, Math.round(wordCount / 230));

  return {
    ...meta,
    html,
    structure,
    wordCount,
    readingMinutes,
  };
}

export const getPosts = cache(async () => {
  return Promise.all(postMetadata.map(loadPost));
});

export const getPost = cache(async (slug: string) => {
  const meta = postMetadata.find((post) => post.slug === slug);
  if (!meta) return null;
  return loadPost(meta);
});

export function getPostSlugs() {
  return postMetadata.map((post) => post.slug);
}

export function getDraftAbsolutePath(post: Pick<Post, "draftPath">) {
  return path.join(contentRoot, post.draftPath.replace(/^content\//, ""));
}

/**
 * Decorate inline citation markup with a popover containing the reference
 * label, so hover shows the citation in place. Also assigns ids to each top
 * level paragraph so back-references can scroll to the right paragraph.
 */
export function decorateArticleHtml(
  html: string,
  references: PostReference[],
): string {
  let pIndex = 0;
  // Add id="b-N" to top-level <p> tags (only those without an existing id).
  const withParagraphIds = html.replace(
    /<p(\s[^>]*)?>/g,
    (full, attrs: string | undefined) => {
      pIndex += 1;
      const a = attrs ?? "";
      if (/id=/.test(a)) return full;
      return `<p${a} id="b-${pIndex}">`;
    },
  );

  // Wrap citation sup>a into a span.cite with a popover.
  const decorated = withParagraphIds.replace(
    /<sup>\s*<a href="#ref-(\d+)">(\d+)<\/a>\s*<\/sup>/g,
    (_full, refNum: string, label: string) => {
      const n = Number(refNum);
      const ref = references[n - 1];
      const safeLabel = ref
        ? ref.label.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        : `Reference ${n}`;
      const kind = ref ? ref.kind : "source";
      return (
        `<span class="cite" data-ref="${n}">` +
        `<sup><a href="#ref-${n}" aria-label="See reference ${n}">${label}</a></sup>` +
        `<span class="cite-pop" role="tooltip">` +
        `<span class="cite-pop-kind">${kind}</span>` +
        `<span class="cite-pop-label">${safeLabel}</span>` +
        `</span>` +
        `</span>`
      );
    },
  );

  return decorated;
}
