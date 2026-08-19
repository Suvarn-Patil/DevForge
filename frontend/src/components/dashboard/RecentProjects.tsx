import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../services/projectService";

type Project = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

export default function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();

        const sorted = [...data]
          .sort((a, b) => {
            const dateA = a.createdAt
              ? new Date(a.createdAt).getTime()
              : 0;

            const dateB = b.createdAt
              ? new Date(b.createdAt).getTime()
              : 0;

            return dateB - dateA;
          })
          .slice(0, 5);

        setProjects(sorted);
      } catch (error) {
        console.error(
          "Failed to fetch recent projects:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Recent Projects
        </h2>

        <button
          onClick={() => navigate("/projects")}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          View all →
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-xl bg-zinc-950 p-5 text-zinc-400">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl bg-zinc-950 p-5 text-zinc-400">
            No projects yet.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              onClick={() =>
                navigate(
                  `/projects/${project._id}`
                )
              }
              className="flex cursor-pointer items-center justify-between rounded-xl bg-zinc-950 p-4 transition hover:bg-zinc-800"
            >
              <div>
                <p className="font-medium text-white">
                  {project.name}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {project.description ||
                    "No description"}
                </p>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                Active
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}