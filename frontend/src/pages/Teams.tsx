import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      console.error("Failed to fetch teams:", error);
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
      console.error("Failed to create team:", error);
      setError("Failed to create team.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-white">
          Teams
        </h1>

        <p className="mt-2 text-zinc-400">
          Create teams and manage members.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Create Team */}

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Create Team
        </h2>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
            }}
            placeholder="Team name"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
          />

          <button
            onClick={handleCreate}
            disabled={creating}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>

      {/* Teams */}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white">
          Your Teams
        </h2>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
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
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500"
              >
                <h3 className="text-2xl font-bold text-white">
                  {team.name}
                </h3>

                <p className="mt-3 text-zinc-400">
                  {team.members?.length ?? 0} members
                </p>

                <button
                  onClick={() =>
                    navigate(`/teams/${team._id}`)
                  }
                  className="mt-5 text-sm text-blue-400 hover:text-blue-300"
                >
                  Manage Team →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}