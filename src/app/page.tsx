"use client";
import { useState } from "react";
import {
  useAgentContext,
  useFrontendTool,
  CopilotSidebar,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
};

const initialExpenses: Expense[] = [
  { id: 1, description: "Groceries", amount: 85, category: "Food" },
  { id: 2, description: "Netflix", amount: 15, category: "Entertainment" },
  { id: 3, description: "Uber", amount: 22, category: "Transport" },
];

export default function Page() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  useAgentContext({
    description:
      "The user's current expense list. Each item has an id, description, amount in dollars, and category.",
    value: expenses,
  });

  useFrontendTool({
    name: "addExpense",
    description:
      "Add a new expense when the user mentions spending money on something.",
    parameters: z.object({
      description: z
        .string()
        .describe("What the expense was for, e.g. Lunch, Taxi, Coffee"),
      amount: z.number().describe("How much was spent in dollars"),
      category: z
        .string()
        .describe("Category: Food, Transport, Entertainment, Health, or Other"),
    }),
    handler: async ({ description, amount, category }) => {
      setExpenses((prev) => [
        ...prev,
        { id: Date.now(), description, amount, category },
      ]);
    },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Expenses</h1>
      <ul className="space-y-2">
        {expenses.map((e) => (
          <li key={e.id} className="flex justify-between border-b py-2">
            <span>
              {e.description}{" "}
              <span className="text-gray-400 text-sm">({e.category})</span>
            </span>
            <span>${e.amount}</span>
          </li>
        ))}
      </ul>
      <CopilotSidebar />
    </main>
  );
}
