import { useEffect, useState } from "react";

import {
  createTask,
} from "../../services/taskService";

import {
  getProjects,
} from "../../services/projectService";

import api from "../../api/axios";

type Project = {
  _id: string;
  name: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
};

type Props = {
  onClose: () => void;
};

export default function CreateTaskModal({
  onClose,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [project, setProject] =
    useState("");

  const [assignee, setAssignee] =
    useState<User | null>(null);

  const [assigneeSearch, setAssigneeSearch] =
    useState("");

  const [users, setUsers] =
    useState<User[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [searchingUsers, setSearchingUsers] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================
  // LOAD PROJECTS
  // =========================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);

        const data =
          await getProjects();

        setProjects(data);

        if (data.length > 0) {
          setProject(data[0]._id);
        }
      } catch (error) {
        console.error(
          "Failed to load projects:",
          error
        );

        setError(
          "Failed to load projects."
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // =========================================
  // SEARCH USERS
  // =========================================

  useEffect(() => {
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

        setUsers(response.data);
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
  }, [assigneeSearch]);

  // =========================================
  // CREATE TASK
  // =========================================

  const handleCreate = async () => {
    if (!title.trim()) {
      setError(
        "Task title is required."
      );
      return;
    }

    if (!project) {
      setError(
        "Please select a project."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createTask(
        title.trim(),
        description.trim(),
        project,
        assignee?._id
      );

      onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

        {/* HEADER */}

        <h2 className="text-2xl font-bold text-white">
          Create Task
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Create a task and assign it to a project.
        </p>

        {/* ERROR */}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* PROJECT */}

        <label className="mt-5 block text-sm font-medium text-zinc-300">
          Project
        </label>

        <select
          value={project}
          onChange={(e) =>
            setProject(e.target.value)
          }
          disabled={loadingProjects}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
        >
          {loadingProjects ? (
            <option value="">
              Loading projects...
            </option>
          ) : projects.length === 0 ? (
            <option value="">
              No projects available
            </option>
          ) : (
            projects.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.name}
              </option>
            ))
          )}
        </select>

        {/* TITLE */}

        <label className="mt-5 block text-sm font-medium text-zinc-300">
          Task Title
        </label>

        <input
          placeholder="e.g. Implement authentication"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
        />

        {/* DESCRIPTION */}

        <label className="mt-5 block text-sm font-medium text-zinc-300">
          Description
        </label>

        <textarea
          placeholder="Describe the task..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
        />

        {/* ASSIGNEE */}

        <label className="mt-5 block text-sm font-medium text-zinc-300">
          Assignee
        </label>

        {assignee ? (
          <div className="mt-2 flex items-center justify-between rounded-xl border border-blue-500/40 bg-blue-500/10 p-3">

            <div>
              <p className="font-medium text-white">
                {assignee.name}
              </p>

              <p className="text-xs text-zinc-400">
                {assignee.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAssignee(null);
                setAssigneeSearch("");
              }}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>

          </div>
        ) : (
          <div className="relative">

            <input
              value={assigneeSearch}
              onChange={(e) =>
                setAssigneeSearch(
                  e.target.value
                )
              }
              placeholder="Search by name or email..."
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
            />

            {/* SEARCHING */}

            {searchingUsers && (
              <p className="mt-2 text-xs text-zinc-500">
                Searching...
              </p>
            )}

            {/* RESULTS */}

            {users.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-48 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">

                {users.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      setAssignee(user);
                      setAssigneeSearch("");
                      setUsers([]);
                    }}
                    className="block w-full border-b border-zinc-800 p-3 text-left last:border-b-0 hover:bg-zinc-900"
                  >

                    <p className="font-medium text-white">
                      {user.name}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {user.email}
                    </p>

                  </button>
                ))}

              </div>
            )}

            {/* NO RESULTS */}

            {!searchingUsers &&
              assigneeSearch.trim() &&
              users.length === 0 && (
                <p className="mt-2 text-xs text-zinc-500">
                  No users found.
                </p>
              )}

          </div>
        )}

        {/* BUTTONS */}

        <div className="mt-6 flex gap-3">

          <button
            onClick={onClose}
            disabled={creating}
            className="flex-1 rounded-xl bg-zinc-700 py-3 font-medium text-white hover:bg-zinc-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={
              creating ||
              loadingProjects ||
              !project
            }
            className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating
              ? "Creating..."
              : "Create Task"}
          </button>

        </div>

      </div>

    </div>
  );
}
