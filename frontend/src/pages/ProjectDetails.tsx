import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectTasks } from "../services/projectService";
import { createTask } from "../services/taskService";

export default function ProjectDetails() {
  const { id } = useParams();

  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const fetchTasks = async () => {
    try {
      if (!id) return;

      const data =
        await getProjectTasks(id);

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const handleCreateTask =
    async () => {
      try {
        if (!id) return;

        await createTask(
          title,
          description,
          id
        );

        setTitle("");
        setDescription("");

        fetchTasks();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="min-h-screen bg-zinc-950 p-10">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Project Tasks
      </h1>

      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="mb-4 w-full rounded-lg bg-zinc-950 p-3 text-white"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="mb-4 w-full rounded-lg bg-zinc-950 p-3 text-white"
        />

        <button
          onClick={handleCreateTask}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-500"
        >
          Create Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <h2 className="text-xl font-semibold text-white">
              {task.title}
            </h2>

            <p className="mt-2 text-zinc-400">
              {task.description}
            </p>

            <div className="mt-3 flex gap-4">
              <span className="text-blue-400">
                {task.status}
              </span>

              <span className="text-yellow-400">
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}