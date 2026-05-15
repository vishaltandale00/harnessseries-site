# Harness Series Website Goal Document

## North Star

Create a genuinely beautiful standalone website for **Harness Series**: a serious research-journal-style publication about autonomous harness engineering, self-improving interfaces, model orchestration, retrieval, memory, traces, and the software layers around intelligence.

The site should feel like a carefully designed technical journal rather than a blog template. It should make dense, speculative engineering writing feel precise, intentional, and worth reading slowly.

## Product Goal

The first version should give readers a polished place to discover and read Harness Series essays without depending on Substack. The website is the primary publication surface.

Success means:

- A first-time reader immediately understands that this is an ongoing series about harnesses, agents, interfaces, and software systems around models.
- The home page makes the publication feel credible and curated, with the articles as the central object.
- The article view makes long-form technical writing feel calm, readable, and distinctive.
- The visual system feels designed for the subject matter: rigorous, editorial, systems-oriented, and restrained.
- The site has enough structure to expand into a larger archive of essays, papers, demos, and references.

## Audience

The primary audience is technically sophisticated readers who care about AI systems, coding agents, product infrastructure, interface design, retrieval, memory, evaluations, and the evolution of software around foundation models.

The site should serve:

- Engineers and founders evaluating ideas around agent harnesses.
- AI researchers and builders interested in system-level model performance.
- Readers who want a high-signal archive rather than social-feed-style posts.
- Future collaborators, investors, or users who need to understand the intellectual direction behind the work.

## Content Goal

V1 includes two local draft essays:

- **Autonomous Harness Engineering?** from `content/drafts/autonomous-harness-engineering.md`
- **Harnesses as Self-Improving Infrastructure** from `content/drafts/harnesses-as-self-improving-infrastructure.md`

The drafts should be preserved as raw source material. Do not rewrite the prose for style, polish, or correctness in v1. It is acceptable to convert pasted text into headings, paragraphs, links, sections, and metadata so the site can render it well.

The content system should support:

- Local article files stored in the repo.
- Native in-site article pages.
- Article metadata such as title, slug, date, summary, topics, and references.
- References for papers, demos, products, and external examples.

The site should not include Substack links, subscribe calls to action, RSS import, or any Substack-mirroring behavior in v1.

## Experience Goal

The home page should behave like an editorial index, not a marketing landing page. It should present the publication title, a concise thesis, and a clean archive of essays.

The article page should be the main design achievement. It should use a Pretext-first responsive text system powered by `@chenglou/pretext`, with local HTML as the source content. The reader should feel more intentional than default browser prose: refined line flow, confident spacing, strong section rhythm, and a visible relationship between text, references, and diagrams.

The reading experience should include:

- A focused title block with topic/date metadata.
- A large, comfortable primary text area.
- A restrained reference rail for papers, demos, and external links.
- Responsive layout that feels composed on both desktop and mobile.
- System diagrams that clarify concepts like inner/outer harness loops, traces, memory, retrieval, and orchestration.

## Visual Goal

The site should look like a serious research journal for software systems. It should be typography-led, precise, and visually quiet, but not plain.

Design qualities to optimize for:

- Sharp typographic hierarchy.
- Dense but breathable layouts.
- Fine rules, dividers, captions, and marginal metadata.
- Diagrams with clear structure and minimal ornament.
- A restrained palette that avoids generic AI gradients and decorative blobs.
- Strong alignment and spacing discipline.
- An editorial feel that rewards inspection.

Avoid:

- Generic SaaS landing-page composition.
- Oversized hero marketing sections.
- Decorative gradient backgrounds.
- Stock imagery or abstract AI art.
- Card-heavy layouts that make articles feel like product tiles.
- Substack-like visual imitation.

## Technical Direction

Use Next.js as the application framework and design for Vercel deployment.

Use local HTML content rather than MDX for v1. Keep article HTML as the content source of truth and build a custom Pretext-first reader on top of it.

The implementation should be structured so a future version can add more posts, richer references, experiments, and alternate reading modes without redesigning the whole system.

Expected routes:

- `/` for the editorial article index.
- `/posts/[slug]` for native article reading pages.

Expected reference links for v1:

- Meta-Harness paper: `https://arxiv.org/abs/2603.28052`
- DocLayer mock: `https://doclayer-one.vercel.app/mocks/`
- Meta IDE mock: `https://meta-ide-workspace-mocks-20260513.vercel.app/`

`@chenglou/pretext` should remain an implementation dependency for text layout only. It should not appear as a public article reference unless an article explicitly discusses the library.

## Quality Bar

The website is successful only if it feels intentionally designed. A technically functional article archive is not enough.

Acceptance criteria:

- The home page feels like a publication with a point of view, not a placeholder index.
- The first viewport clearly communicates **Harness Series** as the brand and subject.
- Article pages are visually superior to default Markdown rendering.
- Text layout remains readable and composed on mobile and desktop.
- References and diagrams support the essay rather than distracting from it.
- No visible layout overlaps, awkward wrapping, or fragile spacing.
- The production build succeeds.
- The site can be deployed to Vercel without special manual steps.

## Implementation Acceptance Checklist

- Next.js app exists and builds successfully.
- Both initial essays exist as local content.
- Home page lists both essays with metadata and summaries.
- Each article has a native route.
- Article rendering uses `@chenglou/pretext` as a core part of the reading surface.
- Article pages include reference rail behavior.
- System diagrams are present and visually consistent with the journal direction.
- No Substack-specific UI or links are present.
- Desktop and mobile screenshots pass visual inspection for beauty, hierarchy, and readability.
