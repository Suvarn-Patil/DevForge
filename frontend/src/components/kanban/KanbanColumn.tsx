import { updateTaskStatus } from "../../services/taskService";

type Task = {
  id: string;
  title: string;
  priority: string;
  assignee: string;
  due: string;
};

type Props = {
  title: string;
  tasks: Task[];
};

function priorityColor(priority: string) {
  switch (priority) {
    case "High":
      return "bg-red-500/20 text-red-400";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-green-500/20 text-green-400";
  }
}

export default function KanbanColumn({
  title,
  tasks,
}: Props) {
  const handleStatusChange = async (
  taskId: string,
  status: string
) => {
  try {
    await updateTaskStatus(taskId, status);

    console.log("Task updated");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="mb-5 text-xl font-bold text-white">
        {title}
      </h2>

      <div className="space-y-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-blue-500"
          >
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>

              <span className="text-sm text-zinc-500">
                {task.due}
              </span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">
              {task.title}
            </h3>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                👤 {task.assignee}
              </span>
            </div>

            <div className="mt-4">
              {title.includes("Todo") && (
                <button
                  onClick={() =>
                    handleStatusChange(
                      task.id,
                      "inprogress"
                    )
                  }
                  className="w-full rounded-lg bg-blue-600 py-2 text-white"
                >
                  Start
                </button>
              )}

              {title.includes("In Progress") && (
                <button
                  onClick={() =>
                    handleStatusChange(
                      task.id,
                      "review"
                    )
                  }
                  className="w-full rounded-lg bg-yellow-600 py-2 text-white"
                >
                  Review
                </button>
              )}

              {title.includes("Review") && (
                <button
                  onClick={() =>
                    handleStatusChange(
                      task.id,
                      "done"
                    )
                  }
                  className="w-full rounded-lg bg-green-600 py-2 text-white"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}