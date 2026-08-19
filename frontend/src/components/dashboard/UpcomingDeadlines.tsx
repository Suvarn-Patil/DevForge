import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getTasks,
  type Task,
} from "../../services/taskService";

function priorityStyle(
  priority: string
) {
  switch (priority) {
    case "high":
      return "text-red-400 bg-red-500/10";

    case "medium":
      return "text-yellow-400 bg-yellow-500/10";

    default:
      return "text-green-400 bg-green-500/10";
  }
}

function statusStyle(
  status: string
) {
  switch (status) {
    case "inprogress":
      return "text-blue-400 bg-blue-500/10";

    case "review":
      return "text-purple-400 bg-purple-500/10";

    case "done":
      return "text-green-400 bg-green-500/10";

    default:
      return "text-zinc-400 bg-zinc-500/10";
  }
}

function statusLabel(
  status: string
) {
  switch (status) {
    case "inprogress":
      return "In Progress";

    case "review":
      return "Review";

    case "done":
      return "Done";

    default:
      return "Todo";
  }
}

export default function UpcomingDeadlines() {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data =
          await getTasks();

        const pendingTasks =
          data
            .filter(
              (task) =>
                task.status !==
                "done"
            )
            .sort((a, b) => {
              const dateA =
                a.createdAt
                  ? new Date(
                      a.createdAt
                    ).getTime()
                  : 0;

              const dateB =
                b.createdAt
                  ? new Date(
                      b.createdAt
                    ).getTime()
                  : 0;

              return (
                dateB - dateA
              );
            })
            .slice(0, 5);

        setTasks(
          pendingTasks
        );
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

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Upcoming Tasks
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Tasks that still need attention
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/kanban")
          }
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          View Kanban →
        </button>

      </div>

      <div className="mt-6 space-y-4">

        {loading ? (

          <div className="rounded-xl bg-zinc-950 p-5 text-zinc-400">
            Loading tasks...
          </div>

        ) : tasks.length ===
          0 ? (

          <div className="rounded-xl bg-zinc-950 p-8 text-center">

            <p className="text-sm text-zinc-400">
              No pending tasks.
            </p>

            <button
              onClick={() =>
                navigate("/kanban")
              }
              className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            >
              Open Kanban →
            </button>

          </div>

        ) : (

          tasks.map((task) => (

            <button
              key={task._id}
              onClick={() =>
                navigate(
                  `/tasks/${task._id}`
                )
              }
              className="flex w-full items-center justify-between gap-4 rounded-xl bg-zinc-950 p-4 text-left transition hover:bg-zinc-800"
            >

              <div className="min-w-0">

                <p className="truncate font-medium text-white">
                  {task.title}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                      task.status
                    )}`}
                  >
                    {statusLabel(
                      task.status
                    )}
                  </span>

                  <span className="text-xs text-zinc-600">
                    •
                  </span>

                  <span className="text-xs text-zinc-500">
                    {task.createdAt
                      ? new Date(
                          task.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </span>

                </div>

              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${priorityStyle(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>

            </button>

          ))

        )}

      </div>

    </div>
  );
}