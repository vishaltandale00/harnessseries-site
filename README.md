# Harness Series Site

A standalone research-journal-style website for Harness Series essays about the software layer around model intelligence: harnesses, agents, traces, memory, retrieval, and self-improving interfaces.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Content

- Raw drafts live in `content/drafts`.
- Renderable article HTML lives in `content/posts`.
- Post metadata and references are loaded from `src/lib/posts.ts`.

## Deployment

The project is configured for Vercel through `vercel.json` and can be deployed as a standard Next.js application.

Production URL: https://harnessseries-site.vercel.app
