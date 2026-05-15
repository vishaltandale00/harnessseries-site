import type { PostReference } from "@/lib/posts";

type ReferenceRailProps = {
  references: PostReference[];
  citations: Record<number, { paragraphIds: string[] }>;
};

export function ReferenceRail({ references, citations }: ReferenceRailProps) {
  if (!references.length) return null;

  return (
    <aside className="reference-rail" aria-labelledby="reference-heading">
      <p className="eyebrow" id="reference-heading">
        References
      </p>
      <ol>
        {references.map((reference, index) => {
          const num = index + 1;
          const cited = citations[num]?.paragraphIds ?? [];
          return (
            <li id={`ref-${num}`} key={reference.href} data-cited={cited.length}>
              <a href={reference.href} rel="noreferrer" target="_blank">
                <span className="ref-kind">{reference.kind}</span>
                <span className="ref-label">{reference.label}</span>
              </a>
              {cited.length ? (
                <p className="ref-backlinks" aria-label="Cited from">
                  <span aria-hidden="true">&crarr;</span>{" "}
                  {cited.map((pid, i) => {
                    const pIndex = pid.replace(/^b-/, "");
                    return (
                      <a key={pid} href={`#${pid}`} className="ref-backlink">
                        &para;{pIndex}
                        {i < cited.length - 1 ? " " : null}
                      </a>
                    );
                  })}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
