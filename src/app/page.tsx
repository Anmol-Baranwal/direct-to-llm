"use client";
import { useState, useRef, useEffect } from "react";
import {
  useAgentContext,
  useFrontendTool,
  CopilotSidebar,
  ToolCallStatus,
} from "@copilotkit/react-core/v2";
import { z } from "zod";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "in-progress" | "done";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  assignee?: string;
  createdAt: string;
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Redesign the hero section with new brand guidelines",
    priority: "high",
    status: "todo",
    assignee: "Sarah",
    createdAt: "2025-01-01",
  },
  {
    id: "2",
    title: "Fix authentication bug",
    description: "Users getting logged out randomly on mobile",
    priority: "high",
    status: "in-progress",
    assignee: "Jordan",
    createdAt: "2025-01-02",
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all v2 endpoints with examples",
    priority: "medium",
    status: "todo",
    assignee: "Luca",
    createdAt: "2025-01-03",
  },
  {
    id: "4",
    title: "Set up CI/CD pipeline",
    description: "Automate deployments with GitHub Actions",
    priority: "medium",
    status: "in-progress",
    assignee: "Jordan",
    createdAt: "2025-01-04",
  },
  {
    id: "5",
    title: "User research interviews",
    description: "Conduct 5 user interviews for new feature",
    priority: "low",
    status: "done",
    assignee: "Sarah",
    createdAt: "2025-01-05",
  },
  {
    id: "6",
    title: "Performance audit",
    description: "Run Lighthouse audit and fix issues",
    priority: "medium",
    status: "done",
    assignee: "Luca",
    createdAt: "2025-01-06",
  },
];

const ASSIGNEE_COLORS: Record<string, string> = {
  Sarah: "from-pink-500 to-rose-600",
  Jordan: "from-violet-500 to-indigo-600",
  Luca: "from-amber-500 to-orange-600",
};

const COLUMNS: {
  id: Status;
  label: string;
  accent: string;
  headerBg: string;
  bg: string;
  border: string;
  dot: string;
}[] = [
  {
    id: "todo",
    label: "To Do",
    accent: "text-slate-300",
    headerBg: "bg-slate-800/40",
    bg: "bg-slate-900/30",
    border: "border-slate-700/40",
    dot: "bg-slate-400",
  },
  {
    id: "in-progress",
    label: "In Progress",
    accent: "text-blue-300",
    headerBg: "bg-blue-900/20",
    bg: "bg-blue-950/20",
    border: "border-blue-700/30",
    dot: "bg-blue-400",
  },
  {
    id: "done",
    label: "Done",
    accent: "text-emerald-300",
    headerBg: "bg-emerald-900/20",
    bg: "bg-emerald-950/20",
    border: "border-emerald-700/30",
    dot: "bg-emerald-400",
  },
];

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    dot: "bg-red-500",
    text: "text-red-400",
    badge: "bg-red-500/10 border-red-500/25",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-400",
    text: "text-amber-400",
    badge: "bg-amber-500/10 border-amber-500/25",
  },
  low: {
    label: "Low",
    dot: "bg-slate-500",
    text: "text-slate-500",
    badge: "bg-slate-500/10 border-slate-600/30",
  },
};

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const gradient = ASSIGNEE_COLORS[name] ?? "from-violet-500 to-indigo-600";
  const cls = size === "sm" ? "w-5 h-5 text-[10px]" : "w-7 h-7 text-xs";
  return (
    <div
      className={`${cls} rounded-full bg-linear-to-br ${gradient} flex items-center justify-center font-bold text-white shrink-0`}
    >
      {name[0]}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const p = PRIORITY_CONFIG[task.priority];
  return (
    <div className="group bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/40 hover:border-slate-600/60 rounded-xl p-4 transition-all duration-150 cursor-default select-none">
      <h3 className="text-sm font-medium text-slate-100 leading-snug mb-2">
        {task.title}
      </h3>
      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-700/40">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${p.badge} ${p.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          {p.label}
        </span>
        {task.assignee && (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignee} />
            <span className="text-[11px] text-slate-500">{task.assignee}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Column({
  column,
  tasks,
}: {
  column: (typeof COLUMNS)[0];
  tasks: Task[];
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border ${column.border} overflow-hidden`}
    >
      <div className={`${column.headerBg} px-4 py-3 border-b ${column.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${column.dot}`} />
            <span className={`text-sm font-semibold ${column.accent}`}>
              {column.label}
            </span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400">
            {tasks.length}
          </span>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2.5 p-3 flex-1 min-h-[240px] ${column.bg}`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
            <div className="w-8 h-8 rounded-lg border border-dashed border-slate-700 flex items-center justify-center">
              <span className="text-slate-700 text-lg">+</span>
            </div>
            <p className="text-xs text-slate-700">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BoardSummaryCard({
  data,
}: {
  data: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    blocking: Task[];
    total: number;
  };
}) {
  const done = data.byStatus.done ?? 0;
  const total = data.total;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900 mt-2">
      <div className="px-4 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-100">Board Summary</p>
          <span className="text-xs text-slate-500 font-mono">
            {total} tasks
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-mono text-emerald-400 shrink-0">
            {pct}% done
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-800">
        {[
          {
            label: "To Do",
            value: data.byStatus.todo ?? 0,
            color: "text-slate-300",
          },
          {
            label: "In Progress",
            value: data.byStatus["in-progress"] ?? 0,
            color: "text-blue-400",
          },
          {
            label: "Done",
            value: data.byStatus.done ?? 0,
            color: "text-emerald-400",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="py-3 px-3 text-center">
            <p className={`text-2xl font-bold tabular-nums ${color}`}>
              {value}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5 uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>
      {data.blocking.length > 0 && (
        <div className="border-t border-slate-800 px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-semibold text-red-400">
              ⚠ Needs attention
            </span>
            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 rounded-full font-mono">
              {data.blocking.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {data.blocking.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                <p className="text-xs text-slate-400 truncate flex-1">
                  {t.title}
                </p>
                {t.assignee && <Avatar name={t.assignee} size="sm" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useAgentContext({
    description:
      "The current kanban board state. Each task has an id, title, optional description, priority (low/medium/high), status (todo/in-progress/done), optional assignee, and createdAt date.",
    value: tasks,
  });

  useFrontendTool({
    name: "addTask",
    description:
      "Add a new task to the kanban board when the user wants to create a task.",
    parameters: z.object({
      title: z.string().describe("Short title of the task"),
      description: z
        .string()
        .optional()
        .describe("Optional longer description"),
      priority: z
        .enum(["low", "medium", "high"])
        .describe("Task priority level"),
      status: z
        .enum(["todo", "in-progress", "done"])
        .describe("Which column to put the task in, defaults to todo"),
      assignee: z
        .string()
        .optional()
        .describe("Name of the person assigned to this task"),
    }),
    handler: async ({ title, description, priority, status, assignee }) => {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          title,
          description,
          priority,
          status: status ?? "todo",
          assignee,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    },
  });

  useFrontendTool({
    name: "moveTask",
    description:
      "Move a task to a different column/status on the kanban board.",
    parameters: z.object({
      taskId: z.string().describe("The id of the task to move"),
      newStatus: z
        .enum(["todo", "in-progress", "done"])
        .describe("The new status/column for the task"),
    }),
    handler: async ({ taskId, newStatus }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );
    },
  });

  useFrontendTool({
    name: "reassignTask",
    description: "Reassign a task to a different person.",
    parameters: z.object({
      taskId: z.string().describe("The id of the task to reassign"),
      assignee: z.string().describe("Name of the new assignee"),
    }),
    handler: async ({ taskId, assignee }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, assignee } : t)),
      );
    },
  });

  useFrontendTool({
    name: "deleteTask",
    description: "Delete a task from the kanban board.",
    parameters: z.object({
      taskId: z.string().describe("The id of the task to delete"),
    }),
    handler: async ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    },
  });

  useFrontendTool({
    name: "updateTaskPriority",
    description: "Update the priority of an existing task.",
    parameters: z.object({
      taskId: z.string().describe("The id of the task to update"),
      priority: z.enum(["low", "medium", "high"]).describe("The new priority"),
    }),
    handler: async ({ taskId, priority }) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, priority } : t)),
      );
    },
  });

  useFrontendTool({
    name: "showBoardSummary",
    description:
      "Show a visual summary of the board when the user asks for an overview, summary, or status update.",
    parameters: z.object({}),
    handler: async () => {
      const current = tasksRef.current;
      const byStatus = {
        todo: current.filter((t) => t.status === "todo").length,
        "in-progress": current.filter((t) => t.status === "in-progress").length,
        done: current.filter((t) => t.status === "done").length,
      };
      const byPriority = {
        high: current.filter((t) => t.priority === "high").length,
        medium: current.filter((t) => t.priority === "medium").length,
        low: current.filter((t) => t.priority === "low").length,
      };
      const blocking = current.filter(
        (t) => t.priority === "high" && t.status !== "done",
      );
      return JSON.stringify({
        byStatus,
        byPriority,
        blocking,
        total: current.length,
      });
    },
    render: ({ result, status }) => {
      if (status === ToolCallStatus.InProgress) {
        return (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900 mt-2 p-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-sm text-slate-400">
                Calculating board summary...
              </p>
            </div>
          </div>
        );
      }

      if (status === ToolCallStatus.Complete && result) {
        const data = JSON.parse(result as string) as {
          byStatus: Record<string, number>;
          byPriority: Record<string, number>;
          blocking: Task[];
          total: number;
        };
        return <BoardSummaryCard data={data} />;
      }

      return null;
    },
  });

  const tasksByStatus = (status: Status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100">
      <div className="border-b border-slate-800/60 px-8 py-4 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="9" rx="1.5" />
                <rect x="14" y="3" width="7" height="5" rx="1.5" />
                <rect x="14" y="12" width="7" height="9" rx="1.5" />
                <rect x="3" y="16" width="7" height="5" rx="1.5" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-slate-100 tracking-tight">
                Kanban
              </span>
              <span className="ml-2 text-xs text-slate-600">Sprint 1</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400 font-mono">
                {tasks.filter((t) => t.status === "done").length}/{tasks.length}{" "}
                done
              </span>
            </div>
            <div className="flex -space-x-2">
              {["Sarah", "Jordan", "Luca"].map((name) => (
                <div
                  key={name}
                  className="border-2 border-[#0a0d14] rounded-full"
                >
                  <Avatar name={name} size="md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="grid grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <Column key={col.id} column={col} tasks={tasksByStatus(col.id)} />
          ))}
        </div>
      </div>

      <CopilotSidebar />
    </div>
  );
}
