import { useEffect, useState } from "react";

import Topbar from "../components/dashboard/Topbar";
import KanbanColumn from "../components/kanban/KanbanColumn";
import CreateTaskModal from "../components/kanban/CreateTaskModal";

import {
  getTasks,
  type Task,
} from "../services/taskService";

export default function Kanban() {
  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);
    } catch (error) {
      console.error(
        "Failed to fetch tasks:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatTask = (task: Task) => ({
    id: task._id,

    title: task.title,

    description:
      task.description,

    priority:
      task.priority.charAt(0).toUpperCase() +
      task.priority.slice(1),

    assignee:
      task.assignee?.name ??
      "Unassigned",

    due:
      task.status === "done"
        ? "Completed"
        : "Open",
  });

  const todo = tasks
    .filter(
      (task) => task.status === "todo"
    )
    .map(formatTask);

  const progress = tasks
    .filter(
      (task) =>
        task.status === "inprogress"
    )
    .map(formatTask);

  const review = tasks
    .filter(
      (task) => task.status === "review"
    )
    .map(formatTask);

  const done = tasks
    .filter(
      (task) => task.status === "done"
    )
    .map(formatTask);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-950">

      <Topbar />

      <main className="flex-1 p-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Kanban Board
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage all your tasks in one place.
            </p>
          </div>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
          >
            + New Task
          </button>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
            Loading tasks...
          </div>
        ) : (
          <div className="mt-10 grid gap-6 xl:grid-cols-4">

            <KanbanColumn
              title={`Todo (${todo.length})`}
              tasks={todo}
            />

            <KanbanColumn
              title={`In Progress (${progress.length})`}
              tasks={progress}
            />

            <KanbanColumn
              title={`Review (${review.length})`}
              tasks={review}
            />

            <KanbanColumn
              title={`Done (${done.length})`}
              tasks={done}
            />

          </div>
        )}

      </main>

      {showModal && (
        <CreateTaskModal
          onClose={() => {
            setShowModal(false);
            fetchTasks();
          }}
        />
      )}

    </div>
  );
}
