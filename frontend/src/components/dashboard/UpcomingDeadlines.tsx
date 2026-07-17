import { useEffect, useState } from "react";

import { getTasks } from "../../services/authService";

export default function UpcomingDeadlines() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();

        const pendingTasks = data.filter(
          (task: any) => task.status !== "done"
        );

        setTasks(pendingTasks.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-bold text-white">
        Upcoming Tasks
      </h2>

      <div className="mt-6 space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
          >
            <span className="text-white">
              {task.title}
            </span>

            <span className="text-blue-500">
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}