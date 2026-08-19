import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTeam,
  searchUsers,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
  type Team,
  type TeamMember,
  type TeamUser,
} from "../services/teamService";

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] =
    useState<Team | null>(null);

  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState<TeamUser[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<TeamUser | null>(null);

  const [role, setRole] = useState<
    "admin" | "member" | "viewer"
  >("member");

  const [loading, setLoading] =
    useState(true);

  const [searching, setSearching] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  const [error, setError] =
    useState("");

  /* FETCH TEAM */

  const fetchTeam = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await getTeam(id);

      setTeam(data);
    } catch (error) {
      console.error(
        "Failed to fetch team:",
        error
      );

      setError("Failed to load team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  /* SEARCH USERS */

  const handleSearch = async () => {
    if (!search.trim()) {
      setUsers([]);
      setSelectedUser(null);
      return;
    }

    try {
      setSearching(true);
      setError("");

      const results =
        await searchUsers(
          search.trim()
        );

      setUsers(results);
    } catch (error) {
      console.error(
        "Failed to search users:",
        error
      );

      setError("Failed to search users.");
      setUsers([]);
    } finally {
      setSearching(false);
    }
  };

  /* ADD MEMBER */

  const handleAddMember = async () => {
    if (!id || !selectedUser) {
      setError(
        "Please select a user first."
      );
      return;
    }

    try {
      setAdding(true);
      setError("");

      await addTeamMember(
        id,
        selectedUser._id,
        role
      );

      setSearch("");
      setUsers([]);
      setSelectedUser(null);
      setRole("member");

      await fetchTeam();
    } catch (error) {
      console.error(
        "Failed to add member:",
        error
      );

      setError(
        "Failed to add member. The user may already be a member."
      );
    } finally {
      setAdding(false);
    }
  };

  /* CHANGE ROLE */

  const handleRoleChange = async (
    member: TeamMember,
    newRole:
      | "admin"
      | "member"
      | "viewer"
  ) => {
    if (!id) return;

    /*
     * A member can have:
     * - user = ObjectId string
     * - user = populated user object
     * - user = null if the referenced user no longer exists
     */

    const memberUserId =
      typeof member.user === "string"
        ? member.user
        : member.user?._id;

    if (!memberUserId) {
      setError(
        "This member no longer has a valid user account."
      );
      return;
    }

    try {
      setError("");

      await updateMemberRole(
        id,
        memberUserId,
        newRole
      );

      await fetchTeam();
    } catch (error) {
      console.error(
        "Failed to update member role:",
        error
      );

      setError(
        "Failed to update member role."
      );
    }
  };

  /* REMOVE MEMBER */

  const handleRemoveMember = async (
    member: TeamMember
  ) => {
    if (!id) return;

    const memberUserId =
      typeof member.user === "string"
        ? member.user
        : member.user?._id;

    if (!memberUserId) {
      setError(
        "This member no longer has a valid user account."
      );
      return;
    }

    try {
      setError("");

      await removeTeamMember(
        id,
        memberUserId
      );

      await fetchTeam();
    } catch (error) {
      console.error(
        "Failed to remove member:",
        error
      );

      setError(
        "Failed to remove member."
      );
    }
  };

  /* LOADING */

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="mx-auto max-w-5xl text-center text-zinc-400">
          Loading team...
        </div>
      </div>
    );
  }

  /* TEAM NOT FOUND */

  if (!team) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8">
        <div className="mx-auto max-w-5xl">

          <button
            onClick={() =>
              navigate("/teams")
            }
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back to Teams
          </button>

          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
            {error ||
              "Team not found."}
          </div>

        </div>
      </div>
    );
  }

  const members =
    team.members ?? [];

  const currentUserRole =
    team.role;

  const canManageMembers =
    currentUserRole === "owner" ||
    currentUserRole === "admin";

  return (
    <div className="min-h-screen bg-zinc-950 p-8">

      <div className="mx-auto max-w-5xl">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/teams")
          }
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to Teams
        </button>

        {/* HEADER */}

        <div className="mt-6 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold text-white">
              {team.name}
            </h1>

            <p className="mt-2 text-zinc-400">
              {members.length}{" "}
              {members.length === 1
                ? "member"
                : "members"}
            </p>
          </div>

          <button
            onClick={fetchTeam}
            className="rounded-xl border border-zinc-700 px-5 py-3 text-sm text-white hover:border-blue-500"
          >
            Refresh
          </button>

        </div>

        {/* ROLE */}

        <div className="mt-5">

          <span className="rounded-lg bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            Your role:{" "}
            {currentUserRole ||
              "member"}
          </span>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ADD MEMBER */}

        {canManageMembers && (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="text-xl font-semibold text-white">
              Add Member
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Search for a user by name or email.
            </p>

            <div className="mt-5 flex gap-3">

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    handleSearch();
                  }
                }}
                placeholder="Search name or email..."
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
              />

              <button
                onClick={handleSearch}
                disabled={searching}
                className="rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {searching
                  ? "Searching..."
                  : "Search"}
              </button>

            </div>

            {/* SEARCH RESULTS */}

            {users.length > 0 && (
              <div className="mt-4 space-y-3">

                {users.map((user) => {

                  const selected =
                    selectedUser?._id ===
                    user._id;

                  return (
                    <button
                      key={user._id}
                      onClick={() =>
                        setSelectedUser(
                          user
                        )
                      }
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                      }`}
                    >

                      <p className="font-semibold text-white">
                        {user.name ||
                          "Unnamed User"}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        {user.email}
                      </p>

                    </button>
                  );
                })}

              </div>
            )}

            {search &&
              !searching &&
              users.length === 0 && (
                <p className="mt-4 text-sm text-zinc-500">
                  No users found.
                </p>
              )}

            {/* SELECTED USER */}

            {selectedUser && (
              <div className="mt-5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">

                <p className="text-sm text-blue-400">
                  Selected user
                </p>

                <p className="mt-1 font-semibold text-white">
                  {selectedUser.name ||
                    "Unnamed User"}
                </p>

                <p className="text-sm text-zinc-400">
                  {selectedUser.email}
                </p>

              </div>
            )}

            {/* ROLE + ADD */}

            {selectedUser && (
              <div className="mt-5 flex gap-3">

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(
                      e.target.value as
                        | "admin"
                        | "member"
                        | "viewer"
                    )
                  }
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                >
                  <option value="member">
                    Member
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                  <option value="viewer">
                    Viewer
                  </option>
                </select>

                <button
                  onClick={
                    handleAddMember
                  }
                  disabled={adding}
                  className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {adding
                    ? "Adding..."
                    : "Add Member"}
                </button>

              </div>
            )}

          </div>
        )}

        {/* MEMBERS */}

        <div className="mt-8">

          <h2 className="text-2xl font-semibold text-white">
            Team Members
          </h2>

          <div className="mt-5 space-y-4">

            {members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-400">
                No members found.
              </div>
            ) : (
              members.map(
                (member) => {

                  /*
                   * IMPORTANT:
                   * member.user can be null.
                   * Never directly access member.user._id.
                   */

                  const user =
                    typeof member.user ===
                    "string"
                      ? null
                      : member.user;

                  const memberUserId =
                    typeof member.user ===
                    "string"
                      ? member.user
                      : member.user?._id;

                  /*
                   * If the referenced User document
                   * was deleted, keep the team member
                   * visible instead of crashing React.
                   */

                  const displayKey =
                    memberUserId ||
                    `missing-${Math.random()}`;

                  return (
                    <div
                      key={displayKey}
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                          <h3 className="font-semibold text-white">
                            {user?.name ||
                              "Deleted User"}
                          </h3>

                          {user?.email && (
                            <p className="mt-1 text-sm text-zinc-500">
                              {user.email}
                            </p>
                          )}

                          {!user && (
                            <p className="mt-1 text-sm text-zinc-600">
                              User account no longer exists
                            </p>
                          )}

                        </div>

                        <div className="flex items-center gap-3">

                          {member.role ===
                          "owner" ? (
                            <span className="rounded-lg bg-purple-500/10 px-4 py-2 text-sm text-purple-400">
                              Owner
                            </span>
                          ) : canManageMembers &&
                            memberUserId ? (
                            <>
                              <select
                                value={
                                  member.role
                                }
                                onChange={(e) =>
                                  handleRoleChange(
                                    member,
                                    e.target
                                      .value as
                                      | "admin"
                                      | "member"
                                      | "viewer"
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                              >

                                <option value="admin">
                                  Admin
                                </option>

                                <option value="member">
                                  Member
                                </option>

                                <option value="viewer">
                                  Viewer
                                </option>

                              </select>

                              <button
                                onClick={() =>
                                  handleRemoveMember(
                                    member
                                  )
                                }
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <span className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
                              {member.role}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}