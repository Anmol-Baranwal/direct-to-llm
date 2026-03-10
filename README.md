# Direct to LLM

A minimal expense tracker showing the core pattern for adding AI to a React app with CopilotKit.

## The pattern

`useAgentContext` : shares your app state with the AI on every turn. Whatever you pass in becomes part of the LLM's context.

```ts
useAgentContext({
  description: "The user's current expense list",
  value: expenses,
});
```

`useFrontendTool` : defines actions the AI can trigger. You write the handler, the LLM decides when to call it based on the description.

```ts
useFrontendTool({
  name: "addExpense",
  description: "Add an expense when the user mentions spending money.",
  parameters: z.object({
    description: z.string().describe("What it was for"),
    amount: z.number().describe("Amount in dollars"),
  }),
  handler: async ({ description, amount }) => {
    setExpenses((prev) => [...prev, { description, amount }]);
  },
});
```

The `render` prop on `useFrontendTool` takes this further - instead of a text reply, the tool renders an actual React component inline in the chat. This is the Generative UI pattern.

## Docs

- [useAgentContext](https://docs.copilotkit.ai/reference/v2/hooks/useAgentContext)
- [useFrontendTool](https://docs.copilotkit.ai/reference/v2/hooks/useFrontendTool)

## Getting started

Install the dependencies.

```
npm install
```

Add your API key to `.env.local`:

```
OPENAI_API_KEY=sk-proj-...
```

Run the server.

```
npm run dev
```
