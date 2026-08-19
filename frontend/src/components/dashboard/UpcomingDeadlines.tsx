import { useEffect, useState } from "react";

import {
  getTasks,
  type Task,
} from "../../services/taskService";

function priorityStyle(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-500/10";

    case "medium":
      return "text-yellow-400 bg-yellow-500/10";

    default:
      return "text-green-400 bg-green-500/10";
  }
}

export default function UpcomingDeadlines() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();

        const pendingTasks = data
          .filter(
            (task) => task.status !== "done"
          )
          .sort((a, b) => {
            const dateA = a.createdAt
              ? new Date(a.createdAt).getTime()
              : 0;

            const dateB = b.createdAt
              ? new Date(b.createdAt).getTime()
              : 0;

            return dateB - dateA;
          })
          .slice(0, 5);

        setTasks(pendingTasks);
      } catch (error) {
        console.error(
          "Failed to fetch upcoming tasks:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">
        Upcoming Tasks
      </h2>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-xl bg-zinc-950 p-5 text-zinc-400">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl bg-zinc-950 p-5 text-zinc-400">
            No pending tasks.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
            >
              <div>
                <p className="font-medium text-white">
                  {task.title}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {task.status === "inprogress"
                    ? "In Progress"
                    : "Todo"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyle(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}