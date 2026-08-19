import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getProjectTasks,
} from "../services/projectService";

import {
  createTask,
  deleteTask,
  updateTaskStatus,
  type Task,
} from "../services/taskService";

import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
  type Comment,
} from "../services/commentService";

import {
  getProjectActivities,
  type Activity,
} from "../services/activityService";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [activityLoading, setActivityLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [comments, setComments] =
    useState<
      Record<string, Comment[]>
    >({});

  const [commentText, setCommentText] =
    useState<
      Record<string, string>
    >({});

  const [commentLoading, setCommentLoading] =
    useState<
      Record<string, boolean>
    >({});

  const [commentSubmitting, setCommentSubmitting] =
    useState<
      Record<string, boolean>
    >({});

  const [editingComment, setEditingComment] =
    useState<string | null>(null);

  const [editCommentText, setEditCommentText] =
    useState("");

  /* ================================
     FETCH TASKS
  ================================= */

  const fetchTasks = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await getProjectTasks(id);

      setTasks(data);
    } catch (error) {
      console.error(
        "Failed to fetch tasks:",
        error
      );

      setError(
        "Failed to load project tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     FETCH ACTIVITIES
  ================================= */

  const fetchActivities = async () => {
    if (!id) {
      return;
    }

    try {
      setActivityLoading(true);

      const data =
        await getProjectActivities(id);

      setActivities(data);
    } catch (error) {
      console.error(
        "Failed to fetch activities:",
        error
      );
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchActivities();
  }, [id]);

  /* ================================
     FETCH COMMENTS
  ================================= */

  const fetchComments = async (
    taskId: string
  ) => {
    try {
      setCommentLoading(
        (previous) => ({
          ...previous,
          [taskId]: true,
        })
      );

      const data =
        await getComments(taskId);

      setComments(
        (previous) => ({
          ...previous,
          [taskId]: data,
        })
      );
    } catch (error) {
      console.error(
        "Failed to fetch comments:",
        error
      );
    } finally {
      setCommentLoading(
        (previous) => ({
          ...previous,
          [taskId]: false,
        })
      );
    }
  };

  useEffect(() => {
    tasks.forEach((task) => {
      fetchComments(task._id);
    });
  }, [tasks]);

  /* ================================
     CREATE TASK
  ================================= */

  const handleCreateTask = async () => {
    if (!id) {
      return;
    }

    if (!title.trim()) {
      setError(
        "Task title is required."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createTask(
        title.trim(),
        description.trim(),
        id
      );

      setTitle("");
      setDescription("");

      await fetchTasks();
      await fetchActivities();
    } catch (error) {
      console.error(
        "Failed to create task:",
        error
      );

      setError(
        "Failed to create task."
      );
    } finally {
      setCreating(false);
    }
  };

  /* ================================
     UPDATE STATUS
  ================================= */

  const handleStatusChange = async (
    taskId: string,
    status:
      | "todo"
      | "inprogress"
      | "review"
      | "done"
  ) => {
    try {
      setError("");

      await updateTaskStatus(
        taskId,
        status
      );

      await fetchTasks();
      await fetchActivities();
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );

      setError(
        "Failed to update task status."
      );
    }
  };

  /* ================================
     DELETE TASK
  ================================= */

  const handleDeleteTask = async (
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
      setError("");

      await deleteTask(taskId);

      setComments(
        (previous) => {
          const next = {
            ...previous,
          };

          delete next[taskId];

          return next;
        }
      );

      await fetchTasks();
      await fetchActivities();
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError(
        "Failed to delete task."
      );
    }
  };

  /* ================================
     ADD COMMENT
  ================================= */

  const handleCreateComment =
    async (taskId: string) => {
      const text =
        commentText[taskId]?.trim();

      if (!text) {
        return;
      }

      try {
        setCommentSubmitting(
          (previous) => ({
            ...previous,
            [taskId]: true,
          })
        );

        const comment =
          await createComment(
            taskId,
            text
          );

        setComments(
          (previous) => ({
            ...previous,
            [taskId]: [
              ...(previous[taskId] ||
                []),
              comment,
            ],
          })
        );

        setCommentText(
          (previous) => ({
            ...previous,
            [taskId]: "",
          })
        );

        await fetchActivities();
      } catch (error) {
        console.error(
          "Failed to create comment:",
          error
        );

        setError(
          "Failed to create comment."
        );
      } finally {
        setCommentSubmitting(
          (previous) => ({
            ...previous,
            [taskId]: false,
          })
        );
      }
    };

  /* ================================
     EDIT COMMENT
  ================================= */

  const handleEditCommentOpen = (
    comment: Comment
  ) => {
    setEditingComment(
      comment._id
    );

    setEditCommentText(
      comment.text
    );
  };

  /* ================================
     SAVE COMMENT
  ================================= */

  const handleUpdateComment =
    async () => {
      if (!editingComment) {
        return;
      }

      const text =
        editCommentText.trim();

      if (!text) {
        return;
      }

      try {
        const updated =
          await updateComment(
            editingComment,
            text
          );

        setComments(
          (previous) => {
            const next = {
              ...previous,
            };

            Object.keys(next).forEach(
              (taskId) => {
                next[taskId] =
                  next[taskId].map(
                    (comment) =>
                      comment._id ===
                      editingComment
                        ? updated
                        : comment
                  );
              }
            );

            return next;
          }
        );

        setEditingComment(null);
        setEditCommentText("");

        await fetchActivities();
      } catch (error) {
        console.error(
          "Failed to update comment:",
          error
        );

        setError(
          "Failed to update comment."
        );
      }
    };

  /* ================================
     DELETE COMMENT
  ================================= */

  const handleDeleteComment =
    async (
      taskId: string,
      commentId: string
    ) => {
      const confirmed =
        window.confirm(
          "Delete this comment?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteComment(
          commentId
        );

        setComments(
          (previous) => ({
            ...previous,
            [taskId]: (
              previous[taskId] || []
            ).filter(
              (comment) =>
                comment._id !==
                commentId
            ),
          })
        );

        await fetchActivities();
      } catch (error) {
        console.error(
          "Failed to delete comment:",
          error
        );

        setError(
          "Failed to delete comment."
        );
      }
    };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">

      <div className="mx-auto max-w-7xl">

        {/* ================================
            HEADER
        ================================= */}

        <div className="flex items-center justify-between">

          <div>

            <button
              onClick={() =>
                navigate("/projects")
              }
              className="mb-4 text-sm text-zinc-400 hover:text-white"
            >
              ← Back to Projects
            </button>

            <h1 className="text-4xl font-bold text-white">
              Project Tasks
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage tasks and collaborate
              through comments.
            </p>

          </div>

          <button
            onClick={() => {
              fetchTasks();
              fetchActivities();
            }}
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-white hover:border-blue-500"
          >
            Refresh
          </button>

        </div>

        {/* ================================
            ERROR
        ================================= */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ================================
            CREATE TASK
        ================================= */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="text-xl font-semibold text-white">
            Create Task
          </h2>

          <input
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="mt-5 mb-4 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
          />

          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
            className="mb-4 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={
              handleCreateTask
            }
            disabled={creating}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {creating
              ? "Creating..."
              : "Create Task"}
          </button>

        </div>

        {/* ================================
            TASKS
        ================================= */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold text-white">
            Tasks
          </h2>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">

              <h3 className="text-xl font-semibold text-white">
                No tasks yet
              </h3>

              <p className="mt-2 text-zinc-400">
                Create your first task
                above.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-5">

              {tasks.map((task) => {

                const taskComments =
                  comments[
                    task._id
                  ] || [];

                return (
                  <div
                    key={task._id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                  >

                    {/* TASK HEADER */}

                    <div className="flex flex-col justify-between gap-4 md:flex-row">

                      <div>

                        <h3 className="text-xl font-semibold text-white">
                          {task.title}
                        </h3>

                        <p className="mt-2 text-zinc-400">
                          {task.description ||
                            "No description provided."}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteTask(
                            task._id
                          )
                        }
                        className="h-fit rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                      >
                        Delete
                      </button>

                    </div>

                    {/* STATUS + PRIORITY */}

                    <div className="mt-5 flex flex-wrap items-center gap-3">

                      <select
                        value={
                          task.status
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            task._id,
                            e.target
                              .value as
                              | "todo"
                              | "inprogress"
                              | "review"
                              | "done"
                          )
                        }
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
                      >

                        <option value="todo">
                          Todo
                        </option>

                        <option value="inprogress">
                          In Progress
                        </option>

                        <option value="review">
                          Review
                        </option>

                        <option value="done">
                          Done
                        </option>

                      </select>

                      <span className="rounded-lg bg-yellow-500/10 px-3 py-2 text-sm text-yellow-400">
                        Priority:{" "}
                        {task.priority}
                      </span>

                    </div>

                    {/* ================================
                        COMMENTS
                    ================================= */}

                    <div className="mt-6 border-t border-zinc-800 pt-6">

                      <div className="flex items-center justify-between">

                        <h4 className="text-lg font-semibold text-white">
                          Comments
                        </h4>

                        <button
                          onClick={() =>
                            fetchComments(
                              task._id
                            )
                          }
                          className="text-sm text-zinc-500 hover:text-white"
                        >
                          Refresh
                        </button>

                      </div>

                      {commentLoading[
                        task._id
                      ] ? (
                        <div className="mt-4 text-sm text-zinc-500">
                          Loading comments...
                        </div>
                      ) : taskComments.length ===
                        0 ? (
                        <div className="mt-4 rounded-xl border border-dashed border-zinc-800 p-5 text-center text-sm text-zinc-500">
                          No comments yet.
                          Start the
                          conversation.
                        </div>
                      ) : (
                        <div className="mt-4 space-y-3">

                          {taskComments.map(
                            (comment) => (
                              <div
                                key={
                                  comment._id
                                }
                                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                              >

                                <div className="flex items-start justify-between gap-4">

                                  <div>

                                    <p className="font-semibold text-white">
                                      {
                                        comment
                                          .user
                                          ?.name
                                      }
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                      {
                                        comment
                                          .user
                                          ?.email
                                      }
                                    </p>

                                  </div>

                                  <div className="flex gap-2">

                                    <button
                                      onClick={() =>
                                        handleEditCommentOpen(
                                          comment
                                        )
                                      }
                                      className="text-xs text-blue-400 hover:text-blue-300"
                                    >
                                      Edit
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDeleteComment(
                                          task._id,
                                          comment._id
                                        )
                                      }
                                      className="text-xs text-red-400 hover:text-red-300"
                                    >
                                      Delete
                                    </button>

                                  </div>

                                </div>

                                <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">
                                  {
                                    comment.text
                                  }
                                </p>

                                {comment.createdAt && (
                                  <p className="mt-3 text-xs text-zinc-600">
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleString()}
                                  </p>
                                )}

                              </div>
                            )
                          )}

                        </div>
                      )}

                      <div className="mt-5">

                        <textarea
                          value={
                            commentText[
                              task._id
                            ] || ""
                          }
                          onChange={(e) =>
                            setCommentText(
                              (previous) => ({
                                ...previous,
                                [task._id]:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          placeholder="Write a comment..."
                          rows={3}
                          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-white outline-none focus:border-blue-500"
                        />

                        <div className="mt-3 flex justify-end">

                          <button
                            onClick={() =>
                              handleCreateComment(
                                task._id
                              )
                            }
                            disabled={
                              commentSubmitting[
                                task._id
                              ] ||
                              !(
                                commentText[
                                  task._id
                                ] || ""
                              ).trim()
                            }
                            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {commentSubmitting[
                              task._id
                            ]
                              ? "Posting..."
                              : "Post Comment"}
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ================================
            ACTIVITY HISTORY
        ================================= */}

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Activity History
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Recent activity in this project.
              </p>
            </div>

            <button
              onClick={fetchActivities}
              className="text-sm text-zinc-500 hover:text-white"
            >
              Refresh
            </button>

          </div>

          {activityLoading ? (
            <div className="mt-6 text-center text-zinc-500">
              Loading activity...
            </div>
          ) : activities.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
              No activity yet.
            </div>
          ) : (
            <div className="relative mt-6">

              <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-800" />

              <div className="space-y-6">

                {activities.map(
                  (activity) => (
                    <div
                      key={
                        activity._id
                      }
                      className="relative pl-8"
                    >

                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-zinc-900 bg-blue-500" />

                      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                        <p className="text-sm font-medium text-white">
                          {activity.description}
                        </p>

                        {activity.task &&
                          typeof activity.task !==
                            "string" && (
                            <p className="mt-1 text-xs text-zinc-500">
                              Task:{" "}
                              {
                                activity
                                  .task
                                  .title
                              }
                            </p>
                          )}

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600">

                          <span>
                            {activity.user?.name ||
                              "Unknown user"}
                          </span>

                          {activity.createdAt && (
                            <>
                              <span>•</span>

                              <span>
                                {new Date(
                                  activity.createdAt
                                ).toLocaleString()}
                              </span>
                            </>
                          )}

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ================================
          EDIT COMMENT MODAL
      ================================= */}

      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-white">
                Edit Comment
              </h2>

              <button
                onClick={() => {
                  setEditingComment(
                    null
                  );

                  setEditCommentText(
                    ""
                  );
                }}
                className="text-2xl text-zinc-500 hover:text-white"
              >
                ×
              </button>

            </div>

            <textarea
              value={
                editCommentText
              }
              onChange={(e) =>
                setEditCommentText(
                  e.target.value
                )
              }
              rows={5}
              className="mt-6 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
            />

            <div className="mt-5 flex gap-3">

              <button
                onClick={() => {
                  setEditingComment(
                    null
                  );

                  setEditCommentText(
                    ""
                  );
                }}
                className="flex-1 rounded-xl bg-zinc-700 py-3 font-semibold text-white hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleUpdateComment
                }
                disabled={
                  !editCommentText.trim()
                }
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
