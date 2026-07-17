import { useEffect, useState } from "react";
import { getProjects } from "../../services/projectService";

export default function RecentProjects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Recent Projects
      </h2>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="flex items-center justify-between rounded-xl bg-zinc-950 p-4"
          >
            <span className="font-medium text-white">
              {project.name}
            </span>

            <span className="text-blue-400">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}