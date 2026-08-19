import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "../services/projectService";

export default function Projects() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [
    editName,
    setEditName,
  ] = useState("");

  const [
    editDescription,
    setEditDescription,
  ] = useState("");

  const navigate = useNavigate();

  /* ================================
     FETCH PROJECTS
  ================================= */

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getProjects();

      setProjects(data);
    } catch (error) {
      console.error(
        "Failed to fetch projects:",
        error
      );

      setError(
        "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ================================
     CREATE PROJECT
  ================================= */

  const handleCreate = async () => {
    if (!name.trim()) {
      setError(
        "Project name is required."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createProject(
        name.trim(),
        description.trim()
      );

      setName("");
      setDescription("");

      await fetchProjects();
    } catch (error) {
      console.error(
        "Failed to create project:",
        error
      );

      setError(
        "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  /* ================================
     OPEN EDIT MODAL
  ================================= */

  const handleEditOpen = (
    project: Project
  ) => {
    setEditingProject(project);

    setEditName(project.name);

    setEditDescription(
      project.description || ""
    );

    setError("");
  };

  /* ================================
     SAVE PROJECT
  ================================= */

  const handleEditSave =
    async () => {
      if (!editingProject) {
        return;
      }

      if (!editName.trim()) {
        setError(
          "Project name is required."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");

        await updateProject(
          editingProject._id,
          {
            name: editName.trim(),
            description:
              editDescription.trim(),
          }
        );

        setEditingProject(null);

        setEditName("");
        setEditDescription("");

        await fetchProjects();
      } catch (error) {
        console.error(
          "Failed to update project:",
          error
        );

        setError(
          "Failed to update project."
        );
      } finally {
        setSaving(false);
      }
    };

  /* ================================
     DELETE PROJECT
  ================================= */

  const handleDelete =
    async (
      project: Project
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${project.name}"? This action cannot be undone.`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await deleteProject(
          project._id
        );

        await fetchProjects();
      } catch (error) {
        console.error(
          "Failed to delete project:",
          error
        );

        setError(
          "Failed to delete project."
        );
      }
    };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">

      <div className="mx-auto max-w-7xl">

        {/* ================================
            HEADER
        ================================= */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-4xl font-bold text-white">
              Projects
            </h1>

            <p className="mt-2 text-zinc-400">
              Create and manage your
              DevForge projects.
            </p>
          </div>

          <button
            onClick={fetchProjects}
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white transition hover:border-blue-500 hover:bg-zinc-900"
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
            CREATE PROJECT
        ================================= */}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

          <h2 className="text-xl font-semibold text-white">
            Create New Project
          </h2>

          <div className="mt-5">

            <input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Project Name"
              className="mb-4 w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none transition focus:border-blue-500"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Project Description"
              rows={4}
              className="mb-4 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-white outline-none transition focus:border-blue-500"
            />

            <button
              onClick={handleCreate}
              disabled={creating}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create Project"}
            </button>

          </div>

        </div>

        {/* ================================
            PROJECTS
        ================================= */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold text-white">
            Your Projects
          </h2>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">

              <h3 className="text-xl font-semibold text-white">
                No projects yet
              </h3>

              <p className="mt-2 text-zinc-400">
                Create your first
                project above.
              </p>

            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {projects.map(
                (project) => (
                  <div
                    key={project._id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500"
                  >

                    {/* PROJECT HEADER */}

                    <div className="flex items-start justify-between gap-4">

                      <h3 className="text-2xl font-bold text-white">
                        {project.name}
                      </h3>

                      <span className="shrink-0 rounded-lg bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                        Project
                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-4 min-h-12 text-zinc-400">
                      {project.description ||
                        "No description provided."}
                    </p>

                    {/* OPEN */}

                    <button
                      onClick={() =>
                        navigate(
                          `/projects/${project._id}`
                        )
                      }
                      className="mt-6 w-full rounded-xl border border-zinc-700 py-3 text-sm font-medium text-blue-400 transition hover:border-blue-500 hover:bg-blue-500/10"
                    >
                      Open Project →
                    </button>

                    {/* EDIT / DELETE */}

                    <div className="mt-3 flex gap-3">

                      <button
                        onClick={() =>
                          handleEditOpen(
                            project
                          )
                        }
                        className="flex-1 rounded-xl bg-zinc-700 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            project
                          )
                        }
                        className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

      {/* ================================
          EDIT PROJECT MODAL
      ================================= */}

      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">

          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-white">
                Edit Project
              </h2>

              <button
                onClick={() =>
                  setEditingProject(null)
                }
                className="text-2xl text-zinc-500 hover:text-white"
              >
                ×
              </button>

            </div>

            {/* NAME */}

            <label className="mt-6 block text-sm font-medium text-zinc-400">
              Project Name
            </label>

            <input
              value={editName}
              onChange={(e) =>
                setEditName(
                  e.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
            />

            {/* DESCRIPTION */}

            <label className="mt-5 block text-sm font-medium text-zinc-400">
              Description
            </label>

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(
                  e.target.value
                )
              }
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white outline-none focus:border-blue-500"
            />

            {/* BUTTONS */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setEditingProject(null)
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
                  !editName.trim()
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

    </div>
  );
}
