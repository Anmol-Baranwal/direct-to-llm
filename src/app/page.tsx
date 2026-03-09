"use client";
import { useState, useRef } from "react";
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

type SummaryResult = {
  summary: Record<string, number>;
  total: number;
} | null;

const initialExpenses: Expense[] = [
  { id: 1, description: "Groceries", amount: 85, category: "Food" },
  { id: 2, description: "Netflix", amount: 15, category: "Entertainment" },
  { id: 3, description: "Uber", amount: 22, category: "Transport" },
];

export default function Page() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const summaryRef = useRef<SummaryResult>(null);

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

  useFrontendTool({
    name: "showSpendingSummary",
    description:
      "Always call this tool when the user asks for a summary of their expenses.",
    parameters: z.object({
      total: z.number().describe("Sum of all expense amounts"),
    }),
    handler: async () => {
      const summary = expenses.reduce(
        (acc, e) => {
          acc[e.category] = (acc[e.category] ?? 0) + e.amount;
          return acc;
        },
        {} as Record<string, number>,
      );
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      summaryRef.current = { summary, total };
      return { summary, total };
    },
    render: ({ status }) => {
      const data = summaryRef.current;
      return (
        <div className="rounded-lg border p-4 mt-2 space-y-3">
          <p className="font-semibold text-sm">
            {status === "inProgress" ? "Calculating..." : "Spending Breakdown"}
          </p>
          {status === "complete" && data && (
            <>
              {Object.entries(data.summary).map(([category, amount]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-medium">${amount}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold border-t pt-2">
                <span>Total</span>
                <span>${data.total}</span>
              </div>
            </>
          )}
        </div>
      );
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
