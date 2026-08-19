import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
  createTeam,
  getTeams,
  type Team,
} from "../services/teamService";

export default function Teams() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTeams();

      setTeams(data);
    } catch (error) {
      console.error(
        "Failed to fetch teams:",
        error
      );

      setError("Failed to load teams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Team name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      await createTeam(name.trim());

      setName("");

      await fetchTeams();
    } catch (error) {
      console.error(
        "Failed to create team:",
        error
      );

      setError("Failed to create team.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-8">

          {/* HEADER */}

          <div>
            <h1 className="text-4xl font-bold text-white">
              Teams
            </h1>

            <p className="mt-2 text-zinc-400">
              Create teams and collaborate with your members.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* CREATE TEAM */}

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <div>
              <h2 className="text-xl font-semibold text-white">
                Create Team
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Start a new workspace for your team.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 md:flex-row">

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
                placeholder="Enter team name..."
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />

              <button
                onClick={handleCreate}
                disabled={creating}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating
                  ? "Creating..."
                  : "Create Team"}
              </button>

            </div>

          </div>

          {/* TEAMS */}

          <div className="mt-10">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Your Teams
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {teams.length}{" "}
                  {teams.length === 1
                    ? "team"
                    : "teams"}
                </p>
              </div>

              <button
                onClick={fetchTeams}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500 hover:text-white"
              >
                Refresh
              </button>

            </div>

            {loading ? (

              <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
                Loading teams...
              </div>

            ) : teams.length === 0 ? (

              <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">

                <h3 className="text-xl font-semibold text-white">
                  No teams yet
                </h3>

                <p className="mt-2 text-zinc-400">
                  Create your first team above.
                </p>

              </div>

            ) : (

              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {teams.map((team) => (

                  <div
                    key={team._id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500 hover:bg-zinc-900/80"
                  >

                    <div className="flex items-start justify-between">

                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {team.name}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-500">
                          {team.members?.length ?? 0}{" "}
                          {team.members?.length === 1
                            ? "member"
                            : "members"}
                        </p>
                      </div>

                      <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                        {team.role || "member"}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/teams/${team._id}`
                        )
                      }
                      className="mt-6 w-full rounded-xl bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      Manage Team →
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}