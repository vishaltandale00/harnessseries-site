# Harness Series Site Improvement Goal

## Objective

Raise the Harness Series website from a functional draft to a publication-quality article site that a technically sophisticated reader would take seriously and want to read.

Current working rating: **5/10**.

Target rating for the next pass: **8/10**.

The improvement process must be evidence-driven: inspect the live/local site, identify concrete issues, implement fixes, score the site again, then run a second review pass to catch what the first pass missed.

## Improvement Loop

1. **Find Improvements**
   - Review the home page and both article pages on desktop and mobile.
   - Use screenshots or Playwright snapshots to identify layout, hierarchy, readability, and interaction issues.
   - Read the article pages as a reader, not just as a builder.
   - Separate issues into four buckets: content structure, visual design, reading experience, and implementation quality.
   - Record the top 5 issues that most reduce credibility or readability.

2. **Prioritize**
   - Fix issues that directly affect reader trust first.
   - Prioritize article-page improvements over homepage polish.
   - Do not add decorative complexity to compensate for weak structure.
   - Keep Pretext as an implementation detail unless it creates visible reader value.
   - Prefer fewer, sharper changes over broad redesign churn.

3. **Implement**
   - Make changes in small commits.
   - Preserve raw draft files unless explicitly editing prose.
   - If prose is improved, create a separate edited article source or clearly distinguish edited content from raw drafts.
   - Keep public references limited to article-relevant sources, papers, demos, and examples.
   - Avoid in-site implementation references unless the article itself discusses them.

4. **Judge Again**
   - Run the scoring rubric below after implementation.
   - Compare the score to the previous 5/10 baseline.
   - Document what improved, what still feels weak, and what should not be changed further.
   - Do not claim success from a passing build alone.

5. **Rereview**
   - Reopen the site after the first improvement pass and review it cold.
   - Check whether the site still feels awkward after the obvious fixes are gone.
   - Look specifically for over-designed elements, weak article rhythm, vague copy, poor mobile reading, and distracting references.
   - Produce a final verdict with a numeric score and the next 3 highest-leverage changes.

## Scoring Rubric

Score each category from 1 to 10, then average them for the site rating.

- **Editorial Clarity**
  - The site immediately explains what Harness Series is and why the topic matters.
  - Article summaries and titles create enough curiosity to click.
  - The article opening feels like a strong piece of writing, not pasted notes.

- **Reading Experience**
  - Article pages are comfortable to read for 5-10 minutes.
  - Line length, font size, spacing, and section rhythm feel intentional.
  - References support the article without interrupting the main text.
  - Mobile reading feels natural, not merely compressed.

- **Visual Design**
  - The site feels like a serious research journal, not a generic blog or SaaS page.
  - Typography, spacing, diagrams, rules, and color choices feel cohesive.
  - The design is distinctive without being weird for its own sake.
  - No visible element feels accidental, cramped, oversized, or decorative-only.

- **Content Architecture**
  - Local drafts, renderable article content, metadata, and references are easy to maintain.
  - Adding another article should be straightforward.
  - Public content does not leak implementation details.
  - The homepage, article pages, and reference rails have clear roles.

- **Technical Quality**
  - `npm run build` passes.
  - Production deployment is live and returns `200` for `/` and article routes.
  - The working tree is clean after commits.
  - No obvious responsive layout failures appear in desktop/mobile verification.

## Minimum Improvement Targets

The next implementation pass should produce:

- A stronger article page layout that feels less like rendered data and more like an edited publication.
- Cleaner article structure with better sectioning and hierarchy.
- Diagrams that are smaller, clearer, and more integrated with the article argument.
- A homepage that makes the reader understand the thesis in the first viewport.
- A reference rail that only contains reader-relevant article sources.
- A visible improvement from the current **5/10** baseline to at least **7/10**, with a credible path to **8/10**.

## Review Checklist

Before judging the site again, verify:

- Desktop home page first viewport.
- Mobile home page first viewport.
- Desktop article page first viewport.
- Mobile article page first viewport.
- Full desktop article reading flow.
- Full mobile article reading flow.
- Reference rail content.
- Diagram readability.
- Build output.
- Production deployment status.

## Final Rereview Output

After implementing improvements, produce a short review with:

- Previous rating.
- New rating.
- What improved.
- What still feels weak.
- Whether the site is ready for external readers.
- The next 3 highest-leverage changes.

The final review should be blunt. If the site is still a 6/10, say so and explain why.
