import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../../services/taskService";

import type {
  KanbanStatus,
} from "../../pages/Kanban";

type Task = {
  id: string;

  title: string;

  description?: string;

  priority: string;

  assignee: string;

  due: string;
};

type Props = {
  title: string;

  status: KanbanStatus;

  tasks: Task[];

  updatingTaskId:
    | string
    | null;

  onStatusChange: (
    taskId: string,
    status: KanbanStatus
  ) => void;

  onUpdatingTask: (
    taskId: string | null
  ) => void;
};

/* ================================
   PRIORITY COLOR
================================ */

function priorityColor(
  priority: string
) {
  switch (priority) {
    case "High":
      return "bg-red-500/20 text-red-400";

    case "Medium":
      return "bg-yellow-500/20 text-yellow-400";

    default:
      return "bg-green-500/20 text-green-400";
  }
}

/* ================================
   STATUS LABEL
================================ */

function statusLabel(
  status: KanbanStatus
) {
  switch (status) {
    case "todo":
      return "Todo";

    case "inprogress":
      return "In Progress";

    case "review":
      return "Review";

    case "done":
      return "Done";
  }
}

export default function KanbanColumn({
  title,
  status,
  tasks,
  updatingTaskId,
  onStatusChange,
  onUpdatingTask,
}: Props) {
  const navigate =
    useNavigate();

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [
    editDescription,
    setEditDescription,
  ] = useState("");

  const [
    editPriority,
    setEditPriority,
  ] = useState<
    "low" | "medium" | "high"
  >("medium");

  const [saving, setSaving] =
    useState(false);

  const [
    dragOver,
    setDragOver,
  ] = useState(false);

  /* ================================
     DRAG START
  ================================= */

  const handleDragStart = (
    event: React.DragEvent,
    taskId: string
  ) => {
    event.dataTransfer.setData(
      "text/task-id",
      taskId
    );

    event.dataTransfer.effectAllowed =
      "move";
  };

  /* ================================
     DRAG OVER
  ================================= */

  const handleDragOver = (
    event: React.DragEvent
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOver(true);
  };

  /* ================================
     DRAG LEAVE
  ================================= */

  const handleDragLeave = () => {
    setDragOver(false);
  };

  /* ================================
     DROP
  ================================= */

  const handleDrop = async (
    event: React.DragEvent
  ) => {
    event.preventDefault();

    setDragOver(false);

    const taskId =
      event.dataTransfer.getData(
        "text/task-id"
      );

    if (!taskId) {
      return;
    }

    try {
      onUpdatingTask(taskId);

      await updateTaskStatus(
        taskId,
        status
      );

      onStatusChange(
        taskId,
        status
      );
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );
    } finally {
      onUpdatingTask(null);
    }
  };

  /* ================================
     BUTTON STATUS CHANGE
  ================================= */

  const handleStatusChange = async (
    taskId: string,
    nextStatus: KanbanStatus
  ) => {
    try {
      onUpdatingTask(taskId);

      await updateTaskStatus(
        taskId,
        nextStatus
      );

      onStatusChange(
        taskId,
        nextStatus
      );
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );
    } finally {
      onUpdatingTask(null);
    }
  };

  /* ================================
     DELETE
  ================================= */

  const handleDelete = async (
    taskId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) {
      return;
    }

    try {
      onUpdatingTask(taskId);

      await deleteTask(taskId);

      window.location.reload();
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      onUpdatingTask(null);
    }
  };

  /* ================================
     OPEN EDIT
  ================================= */

  const handleEditOpen = (
    task: Task
  ) => {
    setEditingTask(task);

    setEditTitle(
      task.title
    );

    setEditDescription(
      task.description || ""
    );

    setEditPriority(
      task.priority.toLowerCase() as
        | "low"
        | "medium"
        | "high"
    );
  };

  /* ================================
     SAVE EDIT
  ================================= */

  const handleEditSave =
    async () => {
      if (!editingTask) {
        return;
      }

      if (!editTitle.trim()) {
        return;
      }

      try {
        setSaving(true);

        await updateTask(
          editingTask.id,
          {
            title:
              editTitle.trim(),

            description:
              editDescription.trim(),

            priority:
              editPriority,
          }
        );

        setEditingTask(null);

        window.location.reload();
      } catch (error) {
        console.error(
          "Failed to update task:",
          error
        );
      } finally {
        setSaving(false);
      }
    };

  /* ================================
     OPEN TASK
  ================================= */

  const handleOpenTask = (
    taskId: string
  ) => {
    navigate(
      `/tasks/${taskId}`
    );
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <>
      <div
        onDragOver={
          handleDragOver
        }
        onDragLeave={
          handleDragLeave
        }
        onDrop={handleDrop}
        className={`rounded-2xl border p-5 transition ${
          dragOver
            ? "border-blue-500 bg-blue-500/5"
            : "border-zinc-800 bg-zinc-900"
        }`}
      >

        {/* COLUMN HEADER */}

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          {dragOver && (
            <span className="text-xs font-medium text-blue-400">
              Drop here
            </span>
          )}

        </div>

        {/* TASKS */}

        <div className="space-y-5">

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
              {dragOver
                ? "Drop task here"
                : "No tasks"}
            </div>
          ) : (
            tasks.map((task) => (

              <div
                key={task.id}
                draggable
                onDragStart={(event) =>
                  handleDragStart(
                    event,
                    task.id
                  )
                }
                onClick={() =>
                  handleOpenTask(
                    task.id
                  )
                }
                className="cursor-grab rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-blue-500 active:cursor-grabbing"
              >

                {/* HEADER */}

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

                {/* TITLE */}

                <h3 className="mt-4 text-lg font-semibold text-white">
                  {task.title}
                </h3>

                {/* DESCRIPTION */}

                {task.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                    {task.description}
                  </p>
                )}

                {/* ASSIGNEE */}

                <div className="mt-5">
                  <span className="text-sm text-zinc-400">
                    👤 {task.assignee}
                  </span>
                </div>

                {/* UPDATING */}

                {updatingTaskId ===
                  task.id && (
                  <div className="mt-3 text-xs text-blue-400">
                    Updating...
                  </div>
                )}

                {/* ACTIONS */}

                <div
                  className="mt-4 space-y-2"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >

                  {/* MOVE BUTTON */}

                  {status === "todo" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          task.id,
                          "inprogress"
                        )
                      }
                      disabled={
                        updatingTaskId ===
                        task.id
                      }
                      className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
                    >
                      Start
                    </button>
                  )}

                  {status ===
                    "inprogress" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          task.id,
                          "review"
                        )
                      }
                      disabled={
                        updatingTaskId ===
                        task.id
                      }
                      className="w-full rounded-lg bg-yellow-600 py-2 text-white hover:bg-yellow-500 disabled:opacity-50"
                    >
                      Send to Review
                    </button>
                  )}

                  {status ===
                    "review" && (
                    <button
                      onClick={() =>
                        handleStatusChange(
                          task.id,
                          "done"
                        )
                      }
                      disabled={
                        updatingTaskId ===
                        task.id
                      }
                      className="w-full rounded-lg bg-green-600 py-2 text-white hover:bg-green-500 disabled:opacity-50"
                    >
                      Complete
                    </button>
                  )}

                  {/* EDIT */}

                  <button
                    onClick={() =>
                      handleEditOpen(
                        task
                      )
                    }
                    className="w-full rounded-lg bg-zinc-700 py-2 text-white hover:bg-zinc-600"
                  >
                    Edit
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDelete(
                        task.id
                      )
                    }
                    disabled={
                      updatingTaskId ===
                      task.id
                    }
                    className="w-full rounded-lg bg-red-600 py-2 text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

      {/* ================================
          EDIT MODAL
      ================================= */}

      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() =>
            setEditingTask(null)
          }
        >

          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-white">
                Edit Task
              </h2>

              <button
                onClick={() =>
                  setEditingTask(null)
                }
                className="text-2xl text-zinc-500 hover:text-white"
              >
                ×
              </button>

            </div>

            {/* TITLE */}

            <label className="mt-6 block text-sm font-medium text-zinc-400">
              Task Title
            </label>

            <input
              value={editTitle}
              onChange={(event) =>
                setEditTitle(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
            />

            {/* DESCRIPTION */}

            <label className="mt-5 block text-sm font-medium text-zinc-400">
              Description
            </label>

            <textarea
              value={
                editDescription
              }
              onChange={(event) =>
                setEditDescription(
                  event.target.value
                )
              }
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
            />

            {/* PRIORITY */}

            <label className="mt-5 block text-sm font-medium text-zinc-400">
              Priority
            </label>

            <select
              value={
                editPriority
              }
              onChange={(event) =>
                setEditPriority(
                  event.target.value as
                    | "low"
                    | "medium"
                    | "high"
                )
              }
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none"
            >
              <option value="low">
                Low
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="high">
                High
              </option>
            </select>

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setEditingTask(null)
                }
                className="flex-1 rounded-xl bg-zinc-700 py-3 font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleEditSave
                }
                disabled={
                  saving ||
                  !editTitle.trim()
                }
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}
