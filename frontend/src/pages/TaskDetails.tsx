import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Topbar from "../components/dashboard/Topbar";

import {
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  type Task,
} from "../services/taskService";

import api from "../api/axios";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] =
    useState<Task | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editPriority, setEditPriority] =
    useState<
      "low" | "medium" | "high"
    >("medium");

  /* ================================
     ASSIGNEE EDITING
  ================================= */

  const [editAssignee, setEditAssignee] =
    useState<User | null>(null);

  const [assigneeSearch, setAssigneeSearch] =
    useState("");

  const [users, setUsers] =
    useState<User[]>([]);

  const [searchingUsers, setSearchingUsers] =
    useState(false);

  /* ================================
     FETCH TASK
  ================================= */

  const fetchTask = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data =
        await getTaskById(id);

      setTask(data);
    } catch (error) {
      console.error(
        "Failed to fetch task:",
        error
      );

      setError(
        "Failed to load task."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  /* ================================
     SEARCH USERS
  ================================= */

  useEffect(() => {
    if (!editing) {
      setUsers([]);
      return;
    }

    if (!assigneeSearch.trim()) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setSearchingUsers(true);

        const response =
          await api.get(
            "/users/search",
            {
              params: {
                search:
                  assigneeSearch.trim(),
              },
            }
          );

        setUsers(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to search users:",
          error
        );

        setUsers([]);
      } finally {
        setSearchingUsers(false);
      }
    };

    const timer = setTimeout(
      searchUsers,
      300
    );

    return () =>
      clearTimeout(timer);
  }, [
    assigneeSearch,
    editing,
  ]);

  /* ================================
     START EDITING
  ================================= */

  const startEditing = () => {
    if (!task) return;

    setEditTitle(task.title);

    setEditDescription(
      task.description || ""
    );

    setEditPriority(
      task.priority
    );

    if (
      task.assignee &&
      typeof task.assignee !==
        "string"
    ) {
      setEditAssignee({
        _id: task.assignee._id,
        name: task.assignee.name,
        email: task.assignee.email,
      });
    } else {
      setEditAssignee(null);
    }

    setAssigneeSearch("");
    setUsers([]);

    setEditing(true);
    setError("");
  };

  /* ================================
     CANCEL EDITING
  ================================= */

  const cancelEditing = () => {
    setEditing(false);

    setAssigneeSearch("");
    setUsers([]);

    setError("");
  };

  /* ================================
     SAVE TASK
  ================================= */

  const handleSave = async () => {
    if (!task) return;

    if (!editTitle.trim()) {
      setError(
        "Task title is required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      const updated =
        await updateTask(
          task._id,
          {
            title:
              editTitle.trim(),

            description:
              editDescription.trim(),

            priority:
              editPriority,

            assignee:
              editAssignee?._id,
          }
        );

      setTask(updated);

      setEditing(false);

      setAssigneeSearch("");
      setUsers([]);
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      setError(
        "Failed to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     UPDATE STATUS
  ================================= */

  const handleStatusChange =
    async (
      status:
        | "todo"
        | "inprogress"
        | "review"
        | "done"
    ) => {
      if (!task) return;

      try {
        setError("");

        const updated =
          await updateTaskStatus(
            task._id,
            status
          );

        setTask(updated);
      } catch (error) {
        console.error(
          "Failed to update status:",
          error
        );

        setError(
          "Failed to update status."
        );
      }
    };

  /* ================================
     DELETE TASK
  ================================= */

  const handleDelete = async () => {
    if (!task) return;

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteTask(
        task._id
      );

      navigate("/kanban");
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError(
        "Failed to delete task."
      );

      setDeleting(false);
    }
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">

        <Topbar />

        <main className="p-8">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
            Loading task...
          </div>

        </main>

      </div>
    );
  }

  /* ================================
     NOT FOUND
  ================================= */

  if (!task) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">

        <Topbar />

        <main className="p-8">

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-400">
            {error ||
              "Task not found."}
          </div>

          <button
            onClick={() =>
              navigate("/kanban")
            }
            className="mt-5 rounded-xl bg-zinc-800 px-5 py-3 text-white hover:bg-zinc-700"
          >
            ← Back to Kanban
          </button>

        </main>

      </div>
    );
  }

  const projectName =
    typeof task.project ===
    "string"
      ? task.project
      : task.project?.name ??
        "Unknown Project";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <Topbar />

      <main className="p-8">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 md:flex-row">

          <div>

            <button
              onClick={() =>
                navigate("/kanban")
              }
              className="mb-4 text-sm text-zinc-400 hover:text-white"
            >
              ← Back to Kanban
            </button>

            {editing ? (

              <input
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(
                    e.target.value
                  )
                }
                className="w-full max-w-3xl rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-3xl font-bold text-white outline-none focus:border-blue-500"
              />

            ) : (

              <h1 className="text-4xl font-bold">
                {task.title}
              </h1>

            )}

            <p className="mt-2 text-zinc-400">
              Task Details
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            {!editing && (
              <button
                onClick={
                  startEditing
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
              >
                Edit Task
              </button>
            )}

            {editing && (
              <>
                <button
                  onClick={
                    cancelEditing
                  }
                  disabled={saving}
                  className="rounded-xl bg-zinc-700 px-5 py-3 font-semibold text-white hover:bg-zinc-600 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving ||
                    !editTitle.trim()
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </>
            )}

            <button
              onClick={
                handleDelete
              }
              disabled={deleting}
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete Task"}
            </button>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* CONTENT */}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-6 lg:col-span-2">

            {/* DESCRIPTION */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <h2 className="text-lg font-semibold">
                Description
              </h2>

              {editing ? (

                <textarea
                  value={
                    editDescription
                  }
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                  rows={7}
                  placeholder="Task description..."
                  className="mt-4 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 leading-7 text-white outline-none focus:border-blue-500"
                />

              ) : (

                <p className="mt-4 whitespace-pre-wrap leading-7 text-zinc-400">
                  {task.description ||
                    "No description provided."}
                </p>

              )}

            </section>

            {/* STATUS */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <h2 className="text-lg font-semibold">
                Status
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                {(
                  [
                    [
                      "todo",
                      "Todo",
                    ],
                    [
                      "inprogress",
                      "In Progress",
                    ],
                    [
                      "review",
                      "Review",
                    ],
                    [
                      "done",
                      "Done",
                    ],
                  ] as const
                ).map(
                  ([
                    value,
                    label,
                  ]) => (

                    <button
                      key={value}
                      onClick={() =>
                        handleStatusChange(
                          value
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                        task.status ===
                        value
                          ? "border-blue-500 bg-blue-500/20 text-blue-400"
                          : "border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>

                  )
                )}

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* DETAILS */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <h2 className="text-lg font-semibold">
                Details
              </h2>

              <div className="mt-5 space-y-6">

                {/* PROJECT */}

                <div>

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Project
                  </p>

                  <p className="mt-1 text-sm text-white">
                    {projectName}
                  </p>

                </div>

                {/* PRIORITY */}

                <div>

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Priority
                  </p>

                  {editing ? (

                    <select
                      value={
                        editPriority
                      }
                      onChange={(e) =>
                        setEditPriority(
                          e.target
                            .value as
                            | "low"
                            | "medium"
                            | "high"
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
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

                  ) : (

                    <span className="mt-2 inline-block rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400">
                      {task.priority
                        .charAt(0)
                        .toUpperCase() +
                        task.priority.slice(
                          1
                        )}
                    </span>

                  )}

                </div>

                {/* ASSIGNEE */}

                <div>

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Assignee
                  </p>

                  {editing ? (

                    <div className="relative mt-2">

                      {editAssignee ? (

                        <div className="flex items-center justify-between rounded-xl border border-blue-500/40 bg-blue-500/10 p-3">

                          <div>

                            <p className="font-medium text-white">
                              {
                                editAssignee.name
                              }
                            </p>

                            <p className="text-xs text-zinc-400">
                              {
                                editAssignee.email
                              }
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditAssignee(
                                null
                              );

                              setAssigneeSearch(
                                ""
                              );

                              setUsers([]);
                            }}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>

                        </div>

                      ) : (

                        <>
                          <input
                            value={
                              assigneeSearch
                            }
                            onChange={(e) =>
                              setAssigneeSearch(
                                e.target
                                  .value
                              )
                            }
                            placeholder="Search by name or email..."
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
                          />

                          {searchingUsers && (
                            <p className="mt-2 text-xs text-zinc-500">
                              Searching...
                            </p>
                          )}

                          {users.length >
                            0 && (

                            <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-48 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">

                              {users.map(
                                (
                                  user
                                ) => (

                                  <button
                                    key={
                                      user._id
                                    }
                                    type="button"
                                    onClick={() => {
                                      setEditAssignee(
                                        user
                                      );

                                      setAssigneeSearch(
                                        ""
                                      );

                                      setUsers(
                                        []
                                      );
                                    }}
                                    className="block w-full border-b border-zinc-800 p-3 text-left last:border-b-0 hover:bg-zinc-900"
                                  >

                                    <p className="font-medium text-white">
                                      {
                                        user.name
                                      }
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                      {
                                        user.email
                                      }
                                    </p>

                                  </button>

                                )
                              )}

                            </div>
                          )}

                          {!searchingUsers &&
                            assigneeSearch.trim() &&
                            users.length ===
                              0 && (

                              <p className="mt-2 text-xs text-zinc-500">
                                No users found.
                              </p>

                            )}
                        </>

                      )}

                    </div>

                  ) : (

                    task.assignee ? (

                      <div className="mt-2">

                        <p className="text-sm font-medium text-white">
                          {
                            task.assignee
                              .name
                          }
                        </p>

                        <p className="text-xs text-zinc-500">
                          {
                            task.assignee
                              .email
                          }
                        </p>

                      </div>

                    ) : (

                      <p className="mt-1 text-sm text-zinc-500">
                        Unassigned
                      </p>

                    )

                  )}

                </div>

              </div>

            </section>

            {/* DATES */}

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <h2 className="text-lg font-semibold">
                Dates
              </h2>

              <div className="mt-5 space-y-4">

                <div>

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {task.createdAt
                      ? new Date(
                          task.createdAt
                        ).toLocaleString()
                      : "Unknown"}
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {task.updatedAt
                      ? new Date(
                          task.updatedAt
                        ).toLocaleString()
                      : "Unknown"}
                  </p>

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}