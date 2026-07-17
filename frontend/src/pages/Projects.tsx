import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
} from "../services/projectService";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    try {
      await createProject(
        name,
        description
      );

      setName("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">
          Projects
        </h1>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Project Name"
          className="mb-4 w-full rounded-lg bg-zinc-950 p-3 text-white"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          className="mb-4 w-full rounded-lg bg-zinc-950 p-3 text-white"
        />

        <button
          onClick={handleCreate}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Create Project
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project._id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              {project.name}
            </h2>

            <p className="mt-3 text-zinc-400">
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}