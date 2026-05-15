"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ArticleBlock = {
  id: string;
  tag: "p" | "h2" | "h3";
  html: string;
  text: string;
};

type Measurement = {
  lineCount: number;
  height: number;
};

type PretextModule = typeof import("@chenglou/pretext");

type PretextArticleProps = {
  html: string;
};

function extractBlocks(html: string): ArticleBlock[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<main>${html}</main>`, "text/html");
  const elements = Array.from(doc.body.querySelectorAll("p, h2, h3"));

  return elements.map((element, index) => ({
    id: `block-${index}`,
    tag: element.tagName.toLowerCase() as ArticleBlock["tag"],
    html: element.innerHTML,
    text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
  }));
}

export function PretextArticle({ html }: PretextArticleProps) {
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(680);
  const [pretext, setPretext] = useState<PretextModule | null>(null);
  const [blocks, setBlocks] = useState<ArticleBlock[] | null>(null);

  useEffect(() => {
    let mounted = true;

    setBlocks(extractBlocks(html));

    import("@chenglou/pretext").then((module) => {
      if (mounted) {
        setPretext(module);
      }
    });

    return () => {
      mounted = false;
    };
  }, [html]);

  useEffect(() => {
    const target = articleRef.current;

    if (!target) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(280, entry.contentRect.width));
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  const measurements = useMemo(() => {
    if (!pretext) {
      return new Map<string, Measurement>();
    }

    const nextMeasurements = new Map<string, Measurement>();

    for (const block of blocks ?? []) {
      if (!block.text) {
        continue;
      }

      const font =
        block.tag === "h2"
          ? "600 28px Georgia"
          : block.tag === "h3"
            ? "600 18px Georgia"
            : "400 19px Georgia";
      const lineHeight = block.tag === "p" ? 32 : block.tag === "h2" ? 36 : 28;
      const prepared = pretext.prepare(block.text, font);
      const result = pretext.layout(prepared, width, lineHeight);

      nextMeasurements.set(block.id, {
        lineCount: result.lineCount,
        height: result.height,
      });
    }

    return nextMeasurements;
  }, [blocks, pretext, width]);

  if (!blocks) {
    return (
      <div
        className="pretext-reader"
        dangerouslySetInnerHTML={{ __html: html }}
        ref={articleRef}
      />
    );
  }

  return (
    <div className="pretext-reader" ref={articleRef}>
      {blocks.map((block) => {
        const measurement = measurements.get(block.id);
        const Component = block.tag;

        return (
          <Component
            className="pretext-block"
            data-lines={measurement?.lineCount ?? undefined}
            dangerouslySetInnerHTML={{ __html: block.html }}
            key={block.id}
            style={
              {
                "--pretext-height": measurement
                  ? `${Math.round(measurement.height)}px`
                  : undefined,
                "--pretext-lines": measurement?.lineCount ?? 1,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
