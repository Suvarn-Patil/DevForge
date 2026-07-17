import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectTasks } from "../services/projectService";

export default function ProjectDetails() {
  const { id } = useParams();

  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!id) return;

        const data = await getProjectTasks(id);

        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-950 p-10">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Project Tasks
      </h1>

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