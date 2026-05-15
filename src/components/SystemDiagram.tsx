import type { Post } from "@/lib/posts";

type SystemDiagramProps = {
  variant: Post["diagram"];
};

export function SystemDiagram({ variant }: SystemDiagramProps) {
  if (variant === "dynamic-interface") {
    return (
      <figure className="system-diagram" aria-label="Dynamic interface harness loop">
        <div className="diagram-band">
          <div className="diagram-node strong">User traces</div>
          <div className="diagram-line" />
          <div className="diagram-node">Quality function</div>
          <div className="diagram-line" />
          <div className="diagram-node strong">Harness evolution</div>
        </div>
        <div className="diagram-grid">
          <span>screenshots</span>
          <span>task velocity</span>
          <span>retrieval policy</span>
          <span>text feedback</span>
          <span>short-term quality</span>
          <span>interface shape</span>
          <span>timelines</span>
          <span>long-term quality</span>
          <span>memory policy</span>
        </div>
        <figcaption>
          Dynamic harnesses treat user traces as the signal for changing what the
          interface stores, retrieves, and presents.
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="system-diagram" aria-label="Meta-harness optimization loop">
      <div className="diagram-stack">
        <div className="diagram-shell outer">
          <span className="diagram-label">Outer loop</span>
          <div className="diagram-shell inner">
            <span className="diagram-label">Inner harness</span>
            <div className="diagram-node">task runtime</div>
            <div className="diagram-node">context</div>
            <div className="diagram-node">memory</div>
            <div className="diagram-node">tools</div>
          </div>
          <div className="diagram-band compact">
            <div className="diagram-node strong">traces</div>
            <div className="diagram-line" />
            <div className="diagram-node strong">candidate code</div>
            <div className="diagram-line" />
            <div className="diagram-node strong">scores</div>
          </div>
        </div>
      </div>
      <figcaption>
        The outer optimization layer inspects prior traces and rewrites the
        harness that controls the model runtime.
      </figcaption>
    </figure>
  );
}
