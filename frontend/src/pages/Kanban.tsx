import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import KanbanColumn from "../components/kanban/KanbanColumn";
import CreateTaskModal from "../components/kanban/CreateTaskModal";

import { getTasks } from "../services/authService";

export default function Kanban() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

const todo = tasks
  .filter((task) => task.status === "todo")
  .map((task) => ({
    id: task._id,
    title: task.title,
    priority:
      task.priority.charAt(0).toUpperCase() +
      task.priority.slice(1),
    assignee: "Suvarn",
    due: "Open",
  }));

const progress = tasks
  .filter((task) => task.status === "inprogress")
  .map((task) => ({
    id: task._id,
    title: task.title,
    priority:
      task.priority.charAt(0).toUpperCase() +
      task.priority.slice(1),
    assignee: "Suvarn",
    due: "Open",
  }));
const review = tasks
  .filter((task) => task.status === "review")
  .map((task) => ({
    id: task._id,
    title: task.title,
    priority:
      task.priority.charAt(0).toUpperCase() +
      task.priority.slice(1),
    assignee: "Suvarn",
    due: "Open",
  }));
const done = tasks
  .filter((task) => task.status === "done")
  .map((task) => ({
    id: task._id,
    title: task.title,
    priority:
      task.priority.charAt(0).toUpperCase() +
      task.priority.slice(1),
    assignee: "Suvarn",
    due: "Completed",
  }));
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">
              Kanban Board
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
            >
              + New Task
            </button>
          </div>

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
        </main>
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}