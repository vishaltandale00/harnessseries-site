import type { PostReference } from "@/lib/posts";

type ReferenceRailProps = {
  references: PostReference[];
};

export function ReferenceRail({ references }: ReferenceRailProps) {
  return (
    <aside className="reference-rail" aria-labelledby="reference-heading">
      <p className="eyebrow" id="reference-heading">
        References
      </p>
      <ol>
        {references.map((reference) => (
          <li key={reference.href}>
            <a href={reference.href} rel="noreferrer" target="_blank">
              <span>{reference.label}</span>
              <small>{reference.kind}</small>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
