# How to Add AI to your App

A kanban board built with [CopilotKit](https://github.com/CopilotKit/CopilotKit) (Next.js) to demonstrate AI that reads your app state and takes actions through natural language.

## What it does

- Move tasks between columns by asking the AI
- Add new tasks from a description
- Get a visual board summary with generative UI

## Getting started

Install the dependencies.

```bash
npm install
```

Add your API key to `.env.local`:

```
OPENAI_API_KEY=sk-proj-...
```

Run the server.

```bash
npm run dev
```

## Branches

| Branch                                      | Description                                                     |
| ------------------------------------------- | --------------------------------------------------------------- |
| `main`                                      | Kanban board demo                                               |
| [`example/basic`](../../tree/example/basic) | Minimal example showing `useAgentContext` and `useFrontendTool` |
