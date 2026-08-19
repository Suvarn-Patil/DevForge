import {
  Bell,
  Search,
  FolderKanban,
  CheckSquare,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getNotifications } from "../../services/notificationService";
import { getProjects } from "../../services/projectService";
import {
  getTasks,
  type Task,
} from "../../services/taskService";
import {
  searchUsers,
  type SearchUser,
} from "../../services/userService";

type Project = {
  _id: string;
  name: string;
  description?: string;
};

export default function Topbar() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] = useState(0);

  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<SearchUser[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications(true);
        setUnreadCount(notifications.length);
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setProjects([]);
      setTasks([]);
      setUsers([]);
      setSearching(false);
      return;
    }

    setSearchOpen(true);
    setSearching(true);

    const timer = setTimeout(async () => {
      const lowerQuery = query.toLowerCase();

      const [projectResult, taskResult, userResult] =
        await Promise.allSettled([
          getProjects(),
          getTasks(),
          searchUsers(query),
        ]);

      if (projectResult.status === "fulfilled") {
        const matchingProjects =
          projectResult.value
            .filter((project) => {
              const name =
                project.name?.toLowerCase() || "";

              const description =
                project.description?.toLowerCase() || "";

              return (
                name.includes(lowerQuery) ||
                description.includes(lowerQuery)
              );
            })
            .slice(0, 5);

        setProjects(matchingProjects);
      } else {
        console.error(
          "Project search failed:",
          projectResult.reason
        );
        setProjects([]);
      }

      if (taskResult.status === "fulfilled") {
        const matchingTasks =
          taskResult.value
            .filter((task) => {
              const title =
                task.title?.toLowerCase() || "";

              const description =
                task.description?.toLowerCase() || "";

              return (
                title.includes(lowerQuery) ||
                description.includes(lowerQuery)
              );
            })
            .slice(0, 5);

        setTasks(matchingTasks);
      } else {
        console.error(
          "Task search failed:",
          taskResult.reason
        );
        setTasks([]);
      }

      if (userResult.status === "fulfilled") {
        setUsers(
          Array.isArray(userResult.value)
            ? userResult.value.slice(0, 5)
            : []
        );
      } else {
        console.error(
          "User search failed:",
          userResult.reason
        );
        setUsers([]);
      }

      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const clearSearch = () => {
    setSearch("");
    setSearchOpen(false);
    setProjects([]);
    setTasks([]);
    setUsers([]);
  };

  const openProject = (id: string) => {
    clearSearch();
    navigate(`/projects/${id}`);
  };

  const openTask = (id: string) => {
    clearSearch();
    navigate(`/tasks/${id}`);
  };

  const openUser = () => {
    clearSearch();
    navigate("/profile");
  };

  const hasResults =
    projects.length > 0 ||
    tasks.length > 0 ||
    users.length > 0;

  return (
    <header className="relative z-40 flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">

      {/* SEARCH */}

      <div className="relative w-full max-w-xl">

        <div className="flex items-center gap-3">

          <Search
            size={20}
            className="shrink-0 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              if (search.trim()) {
                setSearchOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                clearSearch();
              }
            }}
            placeholder="Search projects, tasks, users..."
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-600"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}

        </div>

        {searchOpen && search.trim() && (
          <>
            <div
              className="fixed inset-0 z-[-1]"
              onClick={() =>
                setSearchOpen(false)
              }
            />

            <div className="absolute left-0 top-12 z-[100] w-full overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">

              {searching && (
                <div className="p-5 text-sm text-zinc-400">
                  Searching...
                </div>
              )}

              {!searching && hasResults && (
                <>
                  {projects.length > 0 && (
                    <div className="border-b border-zinc-800">

                      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Projects
                      </div>

                      {projects.map((project) => (
                        <button
                          key={project._id}
                          type="button"
                          onClick={() =>
                            openProject(project._id)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800"
                        >
                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <FolderKanban
                              size={18}
                              className="text-blue-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {project.name}
                            </p>

                            <p className="text-xs text-zinc-500">
                              Project
                            </p>
                          </div>
                        </button>
                      ))}

                    </div>
                  )}

                  {tasks.length > 0 && (
                    <div className="border-b border-zinc-800">

                      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Tasks
                      </div>

                      {tasks.map((task) => (
                        <button
                          key={task._id}
                          type="button"
                          onClick={() =>
                            openTask(task._id)
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800"
                        >
                          <div className="rounded-lg bg-green-500/10 p-2">
                            <CheckSquare
                              size={18}
                              className="text-green-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {task.title}
                            </p>

                            <p className="text-xs text-zinc-500">
                              Task
                            </p>
                          </div>
                        </button>
                      ))}

                    </div>
                  )}

                  {users.length > 0 && (
                    <div>

                      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Users
                      </div>

                      {users.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={openUser}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800"
                        >
                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <User
                              size={18}
                              className="text-purple-400"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">
                              {user.name}
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))}

                    </div>
                  )}
                </>
              )}

              {!searching && !hasResults && (
                <div className="p-5">
                  <p className="text-sm font-medium text-white">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Try searching for a project, task, or user.
                  </p>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* RIGHT SIDE */}

      <div className="ml-8 flex shrink-0 items-center gap-6">

        <button
          type="button"
          onClick={() =>
            navigate("/notifications")
          }
          className="relative rounded-xl p-2 hover:bg-zinc-900"
          aria-label="Notifications"
        >
          <Bell
            size={23}
            className="text-zinc-400 hover:text-white"
          />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate("/profile")
          }
          className="rounded-full"
          aria-label="Open profile"
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="avatar"
            className="h-11 w-11 rounded-full transition hover:ring-2 hover:ring-blue-500"
          />
        </button>

      </div>

    </header>
  );
}
