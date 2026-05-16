# Harnesses as Self-Improving Infrastructure

A harness is the system that turns model intelligence into product behavior. Formally, LLM harnesses are "the code that determines what to store, retrieve and show to the model" ([Meta-Harness](https://arxiv.org/abs/2603.28052)). The term is a more precise alternative to "GPT wrapper," but harnesses around models existed long before GPT-2 ([LangChain](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)).

<details class="formal-lens">
<summary>Formal lens: Definitions of M and H</summary>

The most basic split is not "AI code" versus "ordinary code." It is mathematical function versus product software.

`M_i`: A model is any mathematical function the product can call. It can be as small as `y = ax + b`, a calibrated score, an embedding function, a bandit, a deep ranker, or an LLM.

`H_j`: A harness component is any software in the product system: data lookup, business logic, validation, routing, orchestration, rendering, logging, policy, or process control.

`H(M)`: The product behavior produced when harness components compose around one or more model functions.

```text
M_i : X_i -> Y_i
H_j : product_state x data x rules x model_outputs -> product_state

H = H_n o ... o H_1 o H_0
Y = H(x; M, data, rules)
```

The model returns a value. The harness decides where the value came from, whether it is allowed, how it is combined with other state, what the user sees, and what trace is recorded for the next improvement loop.

</details>

## Recommendation systems were the first harnesses

Systems like Google search, Instagram, and LinkedIn are harnesses around recommendation and ranking models ([Google ranking systems reference](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf)). The models underneath are split into many specialized submodels: encoding a query into an embedding, retrieving results based on the query plus user preferences, reranking those results to prune downstream computation, stitching together content most likely to hold attention, ranking and auctioning that content given the context of what else is on the page, and finally generating an interface around the selected set.

<figure class="figure-block rec-harness-figure" id="fig-1" aria-labelledby="fig-1-cap">
  <div class="rec-harness-card" role="img" aria-label="A recommendation system shown as nested harnesses for retrieval, generation, ranking, and allocation, with sub-harnesses calling model functions">
    <div class="rec-harness-equations">
      <code>H_rec = H_3 o H_2 o H_1 o H_0</code>
      <span>Each macro harness <code>H_i</code> decomposes into sub-harnesses <code>H_i.0...H_i.3</code>. Model calls <code>M_i.*</code> sit inside those software components.</span>
    </div>
    <div class="rec-harness-flow">
      <span><code>H_0</code> Retrieval <em>C_t</em></span>
      <span><code>H_1</code> Generation <em>K_t</em></span>
      <span><code>H_2</code> Ranking <em>S_t</em></span>
      <span><code>H_3</code> Allocation <em>Y_t</em></span>
    </div>
    <div class="rec-harness-grid">
      <div class="rec-stage" data-stage="retrieval">
        <div class="rec-stage-head"><code>H_0</code><strong>Retrieval Harness</strong><small>request -> candidate set</small></div>
        <div class="rec-subgrid">
          <div class="rec-sub"><span>H_0.0</span><strong>Request frame</strong><small>M_0.0 query rewrite</small></div>
          <div class="rec-sub"><span>H_0.1</span><strong>Retrieval fanout</strong><small>M_0.1 exact, M_0.2 variants, M_0.3 semantic</small></div>
          <div class="rec-sub"><span>H_0.2</span><strong>Eligibility filter</strong><small>M_0.4 relevance, M_0.5 risk</small></div>
          <div class="rec-sub"><span>H_0.3</span><strong>Prune + pack</strong><small>M_0.6 cheap ranker</small></div>
        </div>
      </div>
      <div class="rec-stage" data-stage="generation">
        <div class="rec-stage-head"><code>H_1</code><strong>Generation Harness</strong><small>candidates -> content variants</small></div>
        <div class="rec-subgrid">
          <div class="rec-sub"><span>H_1.0</span><strong>Asset lookup</strong><small>M_1.0 template fit</small></div>
          <div class="rec-sub"><span>H_1.1</span><strong>Validation gates</strong><small>M_1.1 copy policy</small></div>
          <div class="rec-sub"><span>H_1.2</span><strong>Input reducer</strong><small>M_1.2 content relevance</small></div>
          <div class="rec-sub"><span>H_1.3</span><strong>Allocate / generate</strong><small>M_1.3 bandit, M_1.4 sequence, M_1.5 LLM copy</small></div>
        </div>
      </div>
      <div class="rec-stage" data-stage="ranking">
        <div class="rec-stage-head"><code>H_2</code><strong>Ranking Harness</strong><small>variants -> scored set</small></div>
        <div class="rec-subgrid">
          <div class="rec-sub"><span>H_2.0</span><strong>Metadata join</strong><small>M_2.0 feature transforms</small></div>
          <div class="rec-sub"><span>H_2.1</span><strong>Feature builder</strong><small>M_2.1 embedding join</small></div>
          <div class="rec-sub"><span>H_2.2</span><strong>Heavy scorers</strong><small>M_2.2 CTR, M_2.3 relevance, M_2.4 value</small></div>
          <div class="rec-sub"><span>H_2.3</span><strong>Calibration</strong><small>M_2.5 score calibration</small></div>
        </div>
      </div>
      <div class="rec-stage" data-stage="allocation">
        <div class="rec-stage-head"><code>H_3</code><strong>Allocation Harness</strong><small>scores -> rendered page</small></div>
        <div class="rec-subgrid">
          <div class="rec-sub"><span>H_3.0</span><strong>Surface frame</strong><small>M_3.0 surface prior</small></div>
          <div class="rec-sub"><span>H_3.1</span><strong>Auction runner</strong><small>M_3.1 auction value</small></div>
          <div class="rec-sub"><span>H_3.2</span><strong>Layout search</strong><small>M_3.2 layout, M_3.3 experience</small></div>
          <div class="rec-sub"><span>H_3.3</span><strong>Render + trace</strong><small>M_3.4 policy suppressor</small></div>
        </div>
      </div>
    </div>
    <div class="rec-trace"><code>tau_t</code><span>Trace: request, candidates, generated variants, scores, allocation, rendering, and feedback become the next layer of data, rules, and model updates.</span></div>
  </div>
  <figcaption id="fig-1-cap"><span class="figure-num">Fig.&nbsp;1</span> A recommendation product as nested harnesses. The model functions score, transform, retrieve, or generate; the harness components decide what data exists, which rules apply, how outputs compose, and what becomes product behavior. <a href="/recommendation-harness">Open the full diagram</a>.</figcaption>
</figure>

These submodels share embeddings, pass hidden layers downstream into later models like RNNs, and sit inside an intricate harness that has to return results in well under a second. Internally they were called infrastructure, and teams of hundreds maintained them to make the product faster, higher quality, more personalized, cheaper to serve, and compliance-safe. The underlying models were proprietary; the harnesses around them were a meaningful piece of the moat. OpenAI changed that paradigm by exposing frontier intelligence through an API, which let anyone build intelligent systems on top and turned the surrounding infrastructure into the most interesting layer to discuss.

<details class="formal-lens">
<summary>Formal lens: Recommendation infrastructure as nested H_rec(M)</summary>

This is the same structure as Fig. 1. A recommendation stack is a harness of harnesses: the top-level product harness composes retrieval, generation, ranking, and allocation, and each stage is itself made from smaller harness components that call model functions at specific points.

`H_0`: Retrieval harness: gather candidates, expand queries, filter obvious failures, and produce `C_t`.

`H_1`: Generation harness: fetch assets, validate content, allocate or generate variants, and produce `K_t`.

`H_2`: Ranking harness: join metadata, build features, call heavier scorers, calibrate scores, and produce `S_t`.

`H_3`: Allocation harness: run marketplace and surface rules, search layout permutations, render the page, and produce `Y_t`.

```text
H_rec = H_3 o H_2 o H_1 o H_0

H_0 = H_0.3 o H_0.2 o H_0.1 o H_0.0
H_1 = H_1.3 o H_1.2 o H_1.1 o H_1.0
H_2 = H_2.3 o H_2.2 o H_2.1 o H_2.0
H_3 = H_3.3 o H_3.2 o H_3.1 o H_3.0

C_t = H_0(q_t, u_t, state_t; M_0.*)
K_t = H_1(C_t, content_store_t, rules_t; M_1.*)
S_t = H_2(K_t, metadata_t, counts_t; M_2.*)
Y_t = H_3(S_t, auction_t, surface_t; M_3.*)

tau_t = log(q_t, C_t, K_t, S_t, Y_t)
```

This is the point of the analogy: the product can evolve from keyword lookup, to learned retrieval, to embeddings, to deep ranking, to LLM-assisted generation while much of the surrounding harness shape remains recognizable. The durable asset is not one model call; it is the composed product system that knows how to use model outputs.

[Open the nested recommendation harness diagram](/recommendation-harness)

</details>

## The static-harness era

The first LLM harnesses that caught my eye were ChatGPT, Perplexity, and Cursor. Each was carefully crafted by a small team to give intelligence an interface for people. It quickly became clear that post-training a model against the harness improved quality, latency, and efficiency, and that frontier labs could win product fit by pairing their smartest model with their own harness. A static harness is effective to train against: the range of user behaviors is well understood, on-policy interactions with the harness are verifiable, and a judge model does not need to learn a new harness for every evaluation.

Architecturally, the model still uses next-token prediction to learn patterns across training examples and applies them at inference. Harnesses like Codex or Claude Code give the model a runtime to execute code, tools to retrieve relevant context, and tools to take action. They are improved by software updates downstream of the engineering team's code and by adding new tools, often called skills or plugins. Beyond that, the harness is fixed and roughly the same for every user.

<details class="formal-lens">
<summary>Formal lens: Why a fixed harness trains well</summary>

In the static-harness regime, the product software `H` is mostly fixed while the model family, prompts, tools, and post-training data improve around that stable interface.

```text
given fixed H
M* = argmax_{M in model_family} E[ Q(tau(H(x; M))) ]
```

Because `H` is stable, traces stay comparable across runs. The model can learn the habits of that product harness: what context is packed, which tools appear, how actions are validated, and what terminal states count as success.

</details>

## Meta-harnesses and per-user evolution

A recent paper on meta-harnesses proposes that letting a model optimize the harness around its task leads to better performance ([Meta-Harness](https://arxiv.org/abs/2603.28052)). By searching over the harness, viewing prior candidate traces, and proposing new options, the outer loop lets the application improve in quality, token usage, and speed. The harness becomes a set of parameters to optimize, not a fixed surface that only changes with a human in the loop.

Autonomously improving harnesses change the paradigm of user-facing applications: from fixed general interfaces with a fringe of customizations, to interfaces that adapt per user. Dynamic per-user harnesses around LLMs have not been widely adopted yet, but this is the area Relayer is moving on quickly. The previous generation of harnesses -- Google, Instagram, and so on -- is a good reference for what personalized harnesses can look like.

<details class="formal-lens">
<summary>Formal lens: Moving search from M to H</summary>

A meta-harness treats product software as the search space. Instead of only asking which model function performs best inside a fixed product, it asks which harness composition should surround the model.

```text
H* = argmax_H E[ Q(tau(H(x; M))) ]
     - lambda_cost C(H)
     - lambda_latency L(H)
     - lambda_risk R(H)

H_{t+1} = improve(H_t, tau_<=t, Q)
```

The outer loop proposes changes to retrieval policy, memory policy, tool routing, validation, prompts, layout, and interface behavior. In this view, code and process around the model become optimizable infrastructure.

</details>

Large-scale consumer systems allocate content using ML models powered by aggregate counts and per-user data. User interactions become a vector representation that proxies that user's preferences. Counts data aggregates interactions across all users and acts as a signal for ranking candidates ([LinkedIn Engineering](https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed)). At scale, with fast updates, this acts as a proxy for content quality or relevance. Fast updates are what let search results and timelines react to real-world events; the user preference vector is what lets the system predict what you want to see. These systems lean on scale and simple signals like clicks to personalize the product for consumers.

Sufficient data and discrete feedback signals were the requirements that kept many consumer applications from becoming personalized. LLMs make it possible to get clear insights with orders of magnitude less data because they are trained on the sum of the public internet. They also turn text feedback into an actionable signal. Consumer applications can now use screenshots, videos, text feedback, and interaction timelines as the traces an outer meta-harness loop uses to propose the next version of the harness. User data becomes the trace signal that improves the harness.

<details class="formal-lens">
<summary>Formal lens: From ranking personalization to harness personalization</summary>

Classic personalization changes scores inside a mostly fixed harness. A self-improving product can instead maintain a user- or group-specific harness state.

```text
H_{u,t+1} = update(H_{u,t}, tau_{u,<=t}, feedback_u, Q)
Y_{u,t}   = H_{u,t}(x_t; M, data, rules)
```

The difference is material. The system is not only changing which content appears; it can change what gets stored, how retrieval works, which tools are exposed, how results are validated, and what interface is generated for the next task.

</details>

## What still needs to work

Speed of evolution and a suitable quality function are the two biggest open problems in the auto-improving interfaces I have been building for Relayer. A five-plus minute overhead on iterating the dynamic harness hurts user engagement. Each iteration walks through prior traces with a recursive language model (DSPy.RLM), proposes different evolutions, and evaluates them before pushing to the user. The quality functions for a dynamic interface have to cover basic functionality, task completeness, task velocity, short-term task quality, and long-term task quality. That deserves its own essay; it has been the largest source of value for Relayer so far.

<details class="formal-lens">
<summary>Formal lens: The bottleneck is Q</summary>

Once `H` can change, the quality function becomes the governor. It has to score product behavior, not just model output.

```text
Q = w_func F
  + w_done D
  + w_velocity V
  + w_short S
  + w_long G
  - w_latency L
  - w_cost C
  - w_risk R
```

For a dynamic interface, the evaluator has to score basic functionality, task completion, user velocity, short-term output quality, long-term user outcome, latency, cost, and product risk before a candidate harness is trusted in front of the user.

</details>

Two prototypes for how the Relayer harness will evolve around a user's task: [DocLayer](https://doclayer-one.vercel.app/mocks/) and the [Meta IDE workspace](https://meta-ide-workspace-mocks-20260513.vercel.app/).
