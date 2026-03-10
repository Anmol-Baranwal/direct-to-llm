# Direct To LLM

A kanban board built with [CopilotKit](https://github.com/CopilotKit/CopilotKit) and Next.js. Demonstrates the pattern of giving an LLM direct access to your app state and actions - no orchestration layer needed.

## What it does

- Move tasks between columns by asking the AI
- Add, delete and reassign tasks from natural language
- Get a visual board summary with generative UI

https://github.com/user-attachments/assets/80fabe4f-93ba-40d7-843a-f93836775f15

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
