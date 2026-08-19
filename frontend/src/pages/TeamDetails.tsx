import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

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

  const getMemberUserId = (
    member: TeamMember
  ) => {
    return typeof member.user === "string"
      ? member.user
      : member.user?._id;
  };

  const handleRoleChange = async (
    member: TeamMember,
    newRole:
      | "admin"
      | "member"
      | "viewer"
  ) => {
    if (!id) return;

    const memberUserId =
      getMemberUserId(member);

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

  const handleRemoveMember = async (
    member: TeamMember
  ) => {
    if (!id) return;

    const memberUserId =
      getMemberUserId(member);

    if (!memberUserId) {
      setError(
        "This member no longer has a valid user account."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to remove this member?"
      );

    if (!confirmed) return;

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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <main className="flex-1 p-8">
            <div className="mx-auto max-w-6xl text-center text-zinc-400">
              Loading team...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <main className="flex-1 p-8">
            <button
              onClick={() =>
                navigate("/teams")
              }
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Teams
            </button>

            <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
              {error || "Team not found."}
            </div>
          </main>
        </div>
      </div>
    );
  }

  const members = team.members ?? [];

  const currentUserRole =
    team.role;

  const canManageMembers =
    currentUserRole === "owner" ||
    currentUserRole === "admin";

  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-8">

          <div className="mx-auto max-w-6xl">

            {/* BACK */}

            <button
              onClick={() =>
                navigate("/teams")
              }
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to Teams
            </button>

            {/* HEADER */}

            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <h1 className="text-4xl font-bold text-white">
                  {team.name}
                </h1>

                <p className="mt-2 text-zinc-400">
                  Manage your team members and permissions.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                  Your role:{" "}
                  {currentUserRole ||
                    "member"}
                </span>

                <button
                  onClick={fetchTeam}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500 hover:text-white"
                >
                  Refresh
                </button>

              </div>

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
                  Search by name or email.
                </p>

                <div className="mt-5 flex flex-col gap-3 md:flex-row">

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
                    placeholder="Search user..."
                    className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
                  />

                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                  >
                    {searching
                      ? "Searching..."
                      : "Search"}
                  </button>

                </div>

                {/* RESULTS */}

                {users.length > 0 && (
                  <div className="mt-4 space-y-2">

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
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 md:flex-row md:items-center">

                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-blue-400">
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

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(
                          e.target
                            .value as
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
                      className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
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

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Team Members
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {members.length}{" "}
                    {members.length === 1
                      ? "member"
                      : "members"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">

                {members.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-400">
                    No members found.
                  </div>

                ) : (

                  members.map(
                    (member) => {

                      const user =
                        typeof member.user ===
                        "string"
                          ? null
                          : member.user;

                      const memberUserId =
                        getMemberUserId(
                          member
                        );

                      return (
                        <div
                          key={
                            memberUserId ||
                            member._id
                          }
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
                                    onChange={(
                                      e
                                    ) =>
                                      handleRoleChange(
                                        member,
                                        e
                                          .target
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
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500"
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

        </main>

      </div>

    </div>
  );
}