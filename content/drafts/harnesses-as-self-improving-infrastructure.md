# Harnesses as Self-Improving Infrastructure

A harness is the system that turns model intelligence into product behavior. Formally, LLM harnesses are "the code that determines what to store, retrieve and show to the model" ([Meta-Harness](https://arxiv.org/abs/2603.28052)). The term is a more precise alternative to "GPT wrapper," but harnesses around models existed long before GPT-2 ([LangChain](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)).

<details class="formal-lens">
<summary>Formal lens: A harness as executable composition</summary>

Let the available models be `M = {M_0, ..., M_k}`. A harness is an executable composition `H_theta = (h_context, h_memory, h_retrieve, h_tool, h_verify, h_ui)` whose subcomponents decide what the model can see, remember, call, validate, and render.

```text
c_t   = h_context(s_t, tau_<t)
m_t   = h_model(s_t, tau_<t)
y_t   = M_{m_t}(c_t)
a_t   = h_route(y_t, s_t)
tau_t = tau_<t + {(s_t, c_t, m_t, y_t, a_t)}
```

The product behavior is therefore not a property of `M` alone. It is the induced policy of the coupled system `(H_theta, M)`.

</details>

## Recommendation systems were the first harnesses

Systems like Google search, Instagram, and LinkedIn are harnesses around recommendation and ranking models ([Google ranking systems reference](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/45530.pdf)). The models underneath are split into many specialized submodels: encoding a query into an embedding, retrieving results based on the query plus user preferences, reranking those results to prune downstream computation, stitching together content most likely to hold attention, ranking and auctioning that content given the context of what else is on the page, and finally generating an interface around the selected set.

These submodels share embeddings, pass hidden layers downstream into later models like RNNs, and sit inside an intricate harness that has to return results in well under a second. Internally they were called infrastructure, and teams of hundreds maintained them to make the product faster, higher quality, more personalized, cheaper to serve, and compliance-safe. The underlying models were proprietary; the harnesses around them were a meaningful piece of the moat. OpenAI changed that paradigm by exposing frontier intelligence through an API, which let anyone build intelligent systems on top and turned the surrounding infrastructure into the most interesting layer to discuss.

<details class="formal-lens">
<summary>Formal lens: Recommendation infrastructure as H_rec</summary>

The recommendation stack is an older instance of the same shape: `H_rec = h_embed -> h_retrieve -> h_rerank -> h_auction -> h_render`. Each stage may call a different model `M_i`, but the user experiences the composed behavior of the harness.

The relevant objective is multi-term: maximize relevance and revenue while satisfying latency, serving cost, policy, and compliance constraints. The moat was not only the private weights; it was the infrastructure that composed many models into one fast product surface.

</details>

## The static-harness era

The first LLM harnesses that caught my eye were ChatGPT, Perplexity, and Cursor. Each was carefully crafted by a small team to give intelligence an interface for people. It quickly became clear that post-training a model against the harness improved quality, latency, and efficiency, and that frontier labs could win product fit by pairing their smartest model with their own harness. A static harness is effective to train against: the range of user behaviors is well understood, on-policy interactions with the harness are verifiable, and a judge model does not need to learn a new harness for every evaluation.

Architecturally, the model still uses next-token prediction to learn patterns across training examples and applies them at inference. Harnesses like Codex or Claude Code give the model a runtime to execute code, tools to retrieve relevant context, and tools to take action. They are improved by software updates downstream of the engineering team's code and by adding new tools, often called skills or plugins. Beyond that, the harness is fixed and roughly the same for every user.

<details class="formal-lens">
<summary>Formal lens: Why a fixed harness trains well</summary>

In the static-harness regime, `theta` is mostly fixed while model weights, system prompts, tools, and post-training data move around it. The optimization target is closer to:

```text
max_phi  E[ Q(tau(H_theta, M_phi, x)) ]
```

Because `H_theta` is stable, training data, on-policy traces, and judge behavior stay comparable across runs. The model can learn the habits of that particular interface: when tools appear, what traces look like, how context is packed, and what counts as a successful terminal state.

</details>

## Meta-harnesses and per-user evolution

A recent paper on meta-harnesses proposes that letting a model optimize the harness around its task leads to better performance ([Meta-Harness](https://arxiv.org/abs/2603.28052)). By searching over the harness, viewing prior candidate traces, and proposing new options, the outer loop lets the application improve in quality, token usage, and speed. The harness becomes a set of parameters to optimize, not a fixed surface that only changes with a human in the loop.

Autonomously improving harnesses change the paradigm of user-facing applications: from fixed general interfaces with a fringe of customizations, to interfaces that adapt per user. Dynamic per-user harnesses around LLMs have not been widely adopted yet, but this is the area Relayer is moving on quickly. The previous generation of harnesses -- Google, Instagram, and so on -- is a good reference for what personalized harnesses can look like.

<details class="formal-lens">
<summary>Formal lens: Moving search from phi to theta</summary>

A meta-harness treats the harness parameters as the search space. Instead of only asking which model weights `phi` perform best, it asks which harness `theta` makes a fixed or changing model system perform best.

```text
theta* = argmax_theta E[ Q(tau(H_theta, M, x)) ]
         - lambda_cost C(H_theta)
         - lambda_lat  L(H_theta)
         - lambda_risk R(H_theta)
```

The outer loop proposes candidate harnesses from source code, prior scores, and execution traces. The important shift is that retrieval policy, memory policy, tool routing, validation, and interface shape become optimizable objects.

</details>

Large-scale consumer systems allocate content using ML models powered by aggregate counts and per-user data. User interactions become a vector representation that proxies that user's preferences. Counts data aggregates interactions across all users and acts as a signal for ranking candidates ([LinkedIn Engineering](https://www.linkedin.com/blog/engineering/feed/engineering-the-next-generation-of-linkedins-feed)). At scale, with fast updates, this acts as a proxy for content quality or relevance. Fast updates are what let search results and timelines react to real-world events; the user preference vector is what lets the system predict what you want to see. These systems lean on scale and simple signals like clicks to personalize the product for consumers.

Sufficient data and discrete feedback signals were the requirements that kept many consumer applications from becoming personalized. LLMs make it possible to get clear insights with orders of magnitude less data because they are trained on the sum of the public internet. They also turn text feedback into an actionable signal. Consumer applications can now use screenshots, videos, text feedback, and interaction timelines as the traces an outer meta-harness loop uses to propose the next version of the harness. User data becomes the trace signal that improves the harness.

<details class="formal-lens">
<summary>Formal lens: From ranking personalization to harness personalization</summary>

Classic personalization estimates a user vector `u` and ranks candidates against it. A self-improving harness can instead evolve a user- or group-specific harness state:

```text
theta_{u,t+1} = update(theta_{u,t}, tau_{u,<=t}, feedback_u)
```

The difference is material. The system is not only changing which content appears; it can change what gets stored, how retrieval works, which tools are exposed, how results are validated, and what interface is generated for the next task.

</details>

## What still needs to work

Speed of evolution and a suitable quality function are the two biggest open problems in the auto-improving interfaces I have been building for Relayer. A five-plus minute overhead on iterating the dynamic harness hurts user engagement. Each iteration walks through prior traces with a recursive language model (DSPy.RLM), proposes different evolutions, and evaluates them before pushing to the user. The quality functions for a dynamic interface have to cover basic functionality, task completeness, task velocity, short-term task quality, and long-term task quality. That deserves its own essay; it has been the largest source of value for Relayer so far.

<details class="formal-lens">
<summary>Formal lens: The bottleneck is Q</summary>

The hard part is defining a quality function that is strong enough to guide evolution without optimizing the wrong behavior.

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
