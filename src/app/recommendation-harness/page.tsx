import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Recommendation Harness Diagram",
  description:
    "A formal diagram of a representative recommendation stack as nested harness components composed with mathematical models.",
};

type ModelCall = {
  id: string;
  label: string;
  maps: string;
};

type SubHarness = {
  id: string;
  label: string;
  role: string;
  calls: ModelCall[];
};

type ServiceHarness = {
  id: string;
  title: string;
  input: string;
  output: string;
  description: string;
  accent: string;
  subHarnesses: SubHarness[];
  evolution: string[];
};

const services: ServiceHarness[] = [
  {
    id: "H_0",
    title: "Retrieval Harness",
    input: "q_t, u_t, request state",
    output: "C_t candidate set",
    description:
      "Retrieval fans out across tables and indexes, applies product constraints, and reduces a huge search space into a candidate set that downstream services can afford to score.",
    accent: "#2c4f63",
    subHarnesses: [
      {
        id: "H_0.0",
        label: "Request frame",
        role: "Normalize query, locale, session, device, and market context.",
        calls: [
          {
            id: "M_0.0",
            label: "query rewrite",
            maps: "q -> normalized q",
          },
        ],
      },
      {
        id: "H_0.1",
        label: "Retrieval fanout",
        role: "Call many retrieval paths over indexes, entity tables, and keyword stores.",
        calls: [
          {
            id: "M_0.1",
            label: "exact match",
            maps: "(q, index) -> hits",
          },
          {
            id: "M_0.2",
            label: "variant expansion",
            maps: "q -> {q_1...q_r}",
          },
          {
            id: "M_0.3",
            label: "semantic retrieve",
            maps: "(q, u, index) -> scored hits",
          },
        ],
      },
      {
        id: "H_0.2",
        label: "Eligibility filter",
        role: "Apply hard business rules, marketplace constraints, and cheap quality gates.",
        calls: [
          {
            id: "M_0.4",
            label: "lite relevance",
            maps: "(q, candidate) -> score",
          },
          {
            id: "M_0.5",
            label: "quality risk",
            maps: "candidate -> risk",
          },
        ],
      },
      {
        id: "H_0.3",
        label: "Prune + pack",
        role: "Deduplicate, cap, rerank cheaply, and produce a bounded candidate set.",
        calls: [
          {
            id: "M_0.6",
            label: "cheap ranker",
            maps: "candidate features -> rank score",
          },
        ],
      },
    ],
    evolution: [
      "keyword lookups",
      "keyword expansion / variant lookup",
      "learned retrieval",
      "embedding retrieval",
    ],
  },
  {
    id: "H_1",
    title: "Generation Harness",
    input: "C_t candidates",
    output: "K_t generated content candidates",
    description:
      "Generation is a construction harness. The models score, select, or generate candidate content; the harness looks up assets, applies validation, compresses inputs, and assembles viable variants.",
    accent: "#8a2a1f",
    subHarnesses: [
      {
        id: "H_1.0",
        label: "Asset lookup",
        role: "Fetch copy tables, assets, templates, source state, and destination metadata.",
        calls: [
          {
            id: "M_1.0",
            label: "template fit",
            maps: "(item, template, surface) -> fit",
          },
        ],
      },
      {
        id: "H_1.1",
        label: "Validation gates",
        role: "Enforce policy, formatting, inventory, and surface compatibility rules.",
        calls: [
          {
            id: "M_1.1",
            label: "copy policy",
            maps: "copy -> allow / suppress",
          },
        ],
      },
      {
        id: "H_1.2",
        label: "Input reducer",
        role: "Top-level filtering reduces the content set before expensive model allocation.",
        calls: [
          {
            id: "M_1.2",
            label: "content relevance",
            maps: "(q, u, item) -> score",
          },
        ],
      },
      {
        id: "H_1.3",
        label: "Allocate / generate",
        role: "Call allocation or generation models in a constrained way, then assemble content variants.",
        calls: [
          {
            id: "M_1.3",
            label: "bandit allocation",
            maps: "(item, feedback) -> arm value",
          },
          {
            id: "M_1.4",
            label: "sequence allocator",
            maps: "(context, assets) -> sequence score",
          },
          {
            id: "M_1.5",
            label: "LLM copy",
            maps: "(context, rules) -> copy",
          },
        ],
      },
    ],
    evolution: [
      "copy tables",
      "multi-arm bandits",
      "content embeddings",
      "sequential deep allocation",
      "LLM copy selection / writing",
    ],
  },
  {
    id: "H_2",
    title: "Ranking Harness",
    input: "K_t generated candidates",
    output: "S_t scored candidates",
    description:
      "Ranking is a heavy scoring harness. It joins counts and metadata, creates model inputs, batches model calls, and calibrates many scores into a comparable ordering.",
    accent: "#4a5a3d",
    subHarnesses: [
      {
        id: "H_2.0",
        label: "Metadata join",
        role: "Load counts data, entity metadata, user features, query features, and page context.",
        calls: [
          {
            id: "M_2.0",
            label: "feature transforms",
            maps: "raw state -> model features",
          },
        ],
      },
      {
        id: "H_2.1",
        label: "Feature builder",
        role: "Create feature tensors and request batches that keep model serving efficient.",
        calls: [
          {
            id: "M_2.1",
            label: "embedding join",
            maps: "(q, item, user) -> dense features",
          },
        ],
      },
      {
        id: "H_2.2",
        label: "Heavy scorers",
        role: "Run deep models for click probability, relevance, bid, quality, and value.",
        calls: [
          {
            id: "M_2.2",
            label: "CTR",
            maps: "(u, q, item, slot) -> P(click)",
          },
          {
            id: "M_2.3",
            label: "relevance",
            maps: "(q, item, user) -> relevance",
          },
          {
            id: "M_2.4",
            label: "bid / value",
            maps: "(scores, bid) -> expected value",
          },
        ],
      },
      {
        id: "H_2.3",
        label: "Calibration",
        role: "Normalize, blend, and rerank scores so allocation can compare candidates.",
        calls: [
          {
            id: "M_2.5",
            label: "score calibration",
            maps: "raw scores -> calibrated scores",
          },
        ],
      },
    ],
    evolution: [
      "counts and rules",
      "feature-heavy rankers",
      "deep relevance / CTR models",
      "calibrated multi-objective scoring",
    ],
  },
  {
    id: "H_3",
    title: "Allocation Harness",
    input: "S_t scored candidates",
    output: "Y_t rendered page",
    description:
      "Allocation is a page construction harness. It runs the auction, generates valid layout permutations, applies surface policy, and chooses the final result shown to the user.",
    accent: "#6d4c7d",
    subHarnesses: [
      {
        id: "H_3.0",
        label: "Surface frame",
        role: "Load search, feed, assistant, or partner surface constraints.",
        calls: [
          {
            id: "M_3.0",
            label: "surface prior",
            maps: "(surface, context) -> layout priors",
          },
        ],
      },
      {
        id: "H_3.1",
        label: "Auction runner",
        role: "Run the marketplace auction under eligibility, reserve, and pricing rules.",
        calls: [
          {
            id: "M_3.1",
            label: "auction value",
            maps: "(scores, bids) -> winner values",
          },
        ],
      },
      {
        id: "H_3.2",
        label: "Layout search",
        role: "Generate and rank page permutations across slots, modules, and content density.",
        calls: [
          {
            id: "M_3.2",
            label: "layout score",
            maps: "(page, candidates) -> page value",
          },
          {
            id: "M_3.3",
            label: "experience score",
            maps: "page -> user experience",
          },
        ],
      },
      {
        id: "H_3.3",
        label: "Render + trace",
        role: "Render the selected page, log impressions, and emit the trace for future feedback.",
        calls: [
          {
            id: "M_3.4",
            label: "policy suppressor",
            maps: "(page, item, user) -> allow / suppress",
          },
        ],
      },
    ],
    evolution: [
      "rule-constrained auctions",
      "layout permutation scoring",
      "surface-specific allocation",
      "feedback-aware page construction",
    ],
  },
];

const flowEquations = [
  "H_rec = H_3 o H_2 o H_1 o H_0",
  "H_i = H_i.3 o H_i.2 o H_i.1 o H_i.0",
  "C_t = H_0(q_t, u_t, state_t; M_0.0...M_0.6)",
  "K_t = H_1(C_t, content_store_t, policy_t; M_1.0...M_1.5)",
  "S_t = H_2(K_t, metadata_t, counts_t; M_2.0...M_2.5)",
  "Y_t = H_3(S_t, auction_t, surface_t; M_3.0...M_3.4)",
  "tau_t = H_log(q_t, C_t, K_t, S_t, Y_t)",
];

const feedbackItems = [
  {
    label: "impressions",
    target: "counts tables",
    detail: "what was shown, where, and under which page policy",
  },
  {
    label: "clicks / conversions",
    target: "ranking features",
    detail: "CTR, relevance, bid, quality, and long-term value signals",
  },
  {
    label: "content outcomes",
    target: "generation allocation",
    detail: "copy variants, template performance, bandit rewards, embeddings",
  },
  {
    label: "policy decisions",
    target: "harness rules",
    detail: "eligibility, suppression, marketplace, layout, and surface rules",
  },
];

const articleHref = "/posts/harnesses-as-self-improving-infrastructure";

export default function RecommendationHarnessPage() {
  return (
    <main className={styles.shell}>
      <nav className={styles.pageNav} aria-label="Page links">
        <Link className={styles.navLink} href="/">
          Harness Series / Archive
        </Link>
        <Link className={styles.navLink} href={articleHref}>
          Read the article
        </Link>
      </nav>

      <header className={styles.header}>
        <p className={styles.kicker}>Diagram / Nested H(M)</p>
        <h1>Recommendation Systems as Nested Model Harnesses</h1>
        <p className={styles.dek}>
          A mature recommendation stack is a harness of harnesses. Each service
          owns business logic, retrieval, validation, orchestration, and state;
          inside those sub-harnesses it calls mathematical models for scores,
          transformations, probabilities, and generated content.
        </p>
        <p className={styles.note}>
          Representative architecture for the formal model. This is not a
          description of any specific company implementation.
        </p>
      </header>

      <section className={styles.thesisGrid} aria-labelledby="formal-title">
        <div className={styles.thesisCopy}>
          <p className={styles.kicker}>Formal split</p>
          <h2 id="formal-title">The product is not a model call</h2>
          <p>
            Let <code>H = {"{H_0, ..., H_n}"}</code> be the product harness:
            the software process that retrieves data, applies business logic,
            routes requests, validates outputs, runs auctions, renders surfaces,
            and records traces. Let <code>M = {"{M_0, ..., M_k}"}</code> be the
            mathematical models available to that process.
          </p>
        </div>
        <div className={styles.formulaStack} aria-label="Formal composition">
          {flowEquations.slice(0, 2).map((eq) => (
            <code key={eq}>{eq}</code>
          ))}
          <span>
            The horizontal path is harness composition. The vertical calls are
            model functions consumed by specific sub-harnesses.
          </span>
        </div>
      </section>

      <section className={styles.macroFlow} aria-label="Macro service flow">
        {services.map((service, index) => (
          <div
            className={styles.macroNode}
            key={service.id}
            style={{ ["--stage-accent" as string]: service.accent }}
          >
            <span>{service.id}</span>
            <strong>{service.title.replace(" Harness", "")}</strong>
            <small>{service.output}</small>
            {index < services.length - 1 ? (
              <i aria-hidden="true" className={styles.macroArrow} />
            ) : null}
          </div>
        ))}
      </section>

      <section className={styles.feedbackPlane} aria-labelledby="feedback-title">
        <div>
          <p className={styles.kicker}>Feedback plane</p>
          <h2 id="feedback-title">The trace becomes infrastructure</h2>
          <p>
            The stack is not only a forward pass. Every rendered page emits a
            trace that becomes counts data, training data, quality signals, and
            harness policy updates.
          </p>
        </div>
        <div className={styles.feedbackGrid}>
          {feedbackItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.target}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.systemMap} aria-labelledby="map-title">
        <div className={styles.sectionHead}>
          <p className={styles.kicker}>Nested system map</p>
          <h2 id="map-title">Each macro harness is built from sub-harnesses</h2>
          <p>
            The model pieces do not form the product by themselves. They are
            called from inside product software that controls inputs, constraints,
            execution order, output interpretation, and feedback.
          </p>
        </div>

        <div className={styles.serviceStack}>
          {services.map((service) => (
            <article
              className={styles.service}
              key={service.id}
              style={{ ["--stage-accent" as string]: service.accent }}
            >
              <header className={styles.serviceHeader}>
                <div>
                  <p className={styles.serviceId}>{service.id}</p>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <dl>
                  <div>
                    <dt>Input</dt>
                    <dd>{service.input}</dd>
                  </div>
                  <div>
                    <dt>Output</dt>
                    <dd>{service.output}</dd>
                  </div>
                </dl>
              </header>

              <div
                className={styles.nestedDiagram}
                style={{
                  ["--columns" as string]: service.subHarnesses.length,
                }}
              >
                <div className={styles.laneLabel}>Harness lane</div>
                <div className={styles.harnessLane}>
                  {service.subHarnesses.map((sub, index) => (
                    <section className={styles.subHarness} key={sub.id}>
                      <span className={styles.subId}>{sub.id}</span>
                      <h4>{sub.label}</h4>
                      <p>{sub.role}</p>
                      {index < service.subHarnesses.length - 1 ? (
                        <i aria-hidden="true" className={styles.subArrow} />
                      ) : null}
                    </section>
                  ))}
                </div>

                <div className={styles.laneLabel}>Model calls</div>
                <div className={styles.modelLane}>
                  {service.subHarnesses.map((sub) => (
                    <div className={styles.modelSlot} key={`${sub.id}-models`}>
                      {sub.calls.map((call) => (
                        <div className={styles.modelCall} key={call.id}>
                          <span>{call.id}</span>
                          <strong>{call.label}</strong>
                          <code>{call.maps}</code>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.evolution}>
                <span>Model evolution inside {service.id}</span>
                <ol>
                  {service.evolution.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.equations} aria-labelledby="state-title">
        <div>
          <p className={styles.kicker}>State flow</p>
          <h2 id="state-title">The scores are intermediate artifacts</h2>
          <p>
            The models return candidates, scores, probabilities, vectors, policy
            labels, and generated text. The harness uses those outputs to build
            a product state and eventually a rendered page.
          </p>
        </div>
        <pre className={styles.codeBlock}>
          <code>{flowEquations.join("\n")}</code>
        </pre>
      </section>

      <section className={styles.takeaway} aria-labelledby="takeaway-title">
        <p className={styles.kicker}>Reading the diagram</p>
        <h2 id="takeaway-title">What makes this a harness</h2>
        <div className={styles.takeawayGrid}>
          <p>
            Each <code>H_i</code> is a product service, and each service is
            itself a composition of smaller <code>H_i.j</code> harness pieces.
          </p>
          <p>
            Each <code>H_i.j</code> may call one or more mathematical models, but
            the harness decides how model outputs become product behavior.
          </p>
          <p>
            This is why the same recommendation stack can move from keyword
            lookup to deep learning to LLM generation without becoming "just a
            model."
          </p>
        </div>
        <Link className={styles.articleLink} href={articleHref}>
          Return to Harnesses as Self-Improving Infrastructure
        </Link>
      </section>
    </main>
  );
}
