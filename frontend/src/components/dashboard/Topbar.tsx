import {
  Bell,
  Search,
  FolderKanban,
  CheckSquare,
  User,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getNotifications,
} from "../../services/notificationService";

import {
  getProjects,
} from "../../services/projectService";

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
  const navigate =
    useNavigate();

  /* ================================
     NOTIFICATIONS
  ================================= */

  const [unreadCount, setUnreadCount] =
    useState(0);

  /* ================================
     SEARCH
  ================================= */

  const [search, setSearch] =
    useState("");

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searching, setSearching] =
    useState(false);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [users, setUsers] =
    useState<SearchUser[]>([]);

  /* ================================
     FETCH NOTIFICATIONS
  ================================= */

  useEffect(() => {
    const fetchUnreadNotifications =
      async () => {
        try {
          const notifications =
            await getNotifications(true);

          setUnreadCount(
            notifications.length
          );
        } catch (error) {
          console.error(
            "Failed to fetch notifications:",
            error
          );
        }
      };

    fetchUnreadNotifications();
  }, []);

  /* ================================
     GLOBAL SEARCH
  ================================= */

  useEffect(() => {
    const query =
      search.trim();

    if (!query) {
      setProjects([]);
      setTasks([]);
      setUsers([]);
      setSearching(false);
      return;
    }

    setSearchOpen(true);

    const timer =
      setTimeout(
        async () => {
          try {
            setSearching(true);

            const [
              projectData,
              taskData,
              userData,
            ] =
              await Promise.all([
                getProjects(),
                getTasks(),
                searchUsers(query),
              ]);

            const lowerQuery =
              query.toLowerCase();

            const matchingProjects =
              projectData
                .filter(
                  (project: Project) =>
                    project.name
                      .toLowerCase()
                      .includes(
                        lowerQuery
                      ) ||
                    (
                      project.description ||
                      ""
                    )
                      .toLowerCase()
                      .includes(
                        lowerQuery
                      )
                )
                .slice(0, 5);

            const matchingTasks =
              taskData
                .filter(
                  (task: Task) =>
                    task.title
                      .toLowerCase()
                      .includes(
                        lowerQuery
                      )
                )
                .slice(0, 5);

            setProjects(
              matchingProjects
            );

            setTasks(
              matchingTasks
            );

            setUsers(
              userData.slice(0, 5)
            );
          } catch (error) {
            console.error(
              "Search failed:",
              error
            );

            setProjects([]);
            setTasks([]);
            setUsers([]);
          } finally {
            setSearching(false);
          }
        },
        300
      );

    return () =>
      clearTimeout(timer);
  }, [search]);

  /* ================================
     CLEAR SEARCH
  ================================= */

  const clearSearch = () => {
    setSearch("");
    setSearchOpen(false);
  };

  /* ================================
     NAVIGATE
  ================================= */

  const openProject = (
    projectId: string
  ) => {
    clearSearch();

    navigate(
      `/projects/${projectId}`
    );
  };

  const openTask = (
    taskId: string
  ) => {
    clearSearch();

    navigate(
      `/tasks/${taskId}`
    );
  };

  const openUser = (
    userId: string
  ) => {
    clearSearch();

    navigate(
      `/profile/${userId}`
    );
  };

  const hasResults =
    projects.length > 0 ||
    tasks.length > 0 ||
    users.length > 0;

  return (
    <header className="relative flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">

      {/* ================================
          SEARCH
      ================================= */}

      <div className="relative w-full max-w-xl">

        <div className="flex items-center gap-3">

          <Search
            size={20}
            className="text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onFocus={() => {
              if (
                search.trim()
              ) {
                setSearchOpen(
                  true
                );
              }
            }}
            placeholder="Search projects, tasks, users..."
            className="w-full bg-transparent text-white outline-none placeholder:text-zinc-600"
          />

          {search && (
            <button
              type="button"
              onClick={
                clearSearch
              }
              className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-900 hover:text-white"
            >
              <X size={17} />
            </button>
          )}

        </div>

        {/* ================================
            SEARCH RESULTS
        ================================= */}

        {searchOpen &&
          search.trim() && (
            <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">

              {/* SEARCHING */}

              {searching && (
                <div className="p-5 text-sm text-zinc-400">
                  Searching...
                </div>
              )}

              {/* NO RESULTS */}

              {!searching &&
                !hasResults && (
                  <div className="p-5 text-sm text-zinc-500">
                    No results found.
                  </div>
                )}

              {/* PROJECTS */}

              {!searching &&
                projects.length > 0 && (
                  <div className="border-b border-zinc-800">

                    <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Projects
                    </div>

                    {projects.map(
                      (project) => (
                        <button
                          key={
                            project._id
                          }
                          type="button"
                          onClick={() =>
                            openProject(
                              project._id
                            )
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-800"
                        >

                          <div className="rounded-lg bg-blue-500/10 p-2">
                            <FolderKanban
                              size={18}
                              className="text-blue-400"
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-white">
                              {
                                project.name
                              }
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                              Project
                            </p>

                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

              {/* TASKS */}

              {!searching &&
                tasks.length > 0 && (
                  <div className="border-b border-zinc-800">

                    <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Tasks
                    </div>

                    {tasks.map(
                      (task) => (
                        <button
                          key={
                            task._id
                          }
                          type="button"
                          onClick={() =>
                            openTask(
                              task._id
                            )
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-800"
                        >

                          <div className="rounded-lg bg-green-500/10 p-2">
                            <CheckSquare
                              size={18}
                              className="text-green-400"
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-white">
                              {
                                task.title
                              }
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                              Task
                            </p>

                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

              {/* USERS */}

              {!searching &&
                users.length > 0 && (
                  <div>

                    <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Users
                    </div>

                    {users.map(
                      (user) => (
                        <button
                          key={
                            user._id
                          }
                          type="button"
                          onClick={() =>
                            openUser(
                              user._id
                            )
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-800"
                        >

                          <div className="rounded-lg bg-purple-500/10 p-2">
                            <User
                              size={18}
                              className="text-purple-400"
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-white">
                              {
                                user.name
                              }
                            </p>

                            <p className="truncate text-xs text-zinc-500">
                              {
                                user.email
                              }
                            </p>

                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

            </div>
          )}

      </div>

      {/* ================================
          RIGHT SIDE
      ================================= */}

      <div className="ml-8 flex shrink-0 items-center gap-6">

        {/* NOTIFICATIONS */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/notifications"
            )
          }
          className="relative rounded-xl p-2 transition hover:bg-zinc-900"
          aria-label="Notifications"
        >

          <Bell
            size={23}
            className="text-zinc-400 transition hover:text-white"
          />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99
                ? "99+"
                : unreadCount}
            </span>
          )}

        </button>

        {/* AVATAR */}

        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="h-11 w-11 rounded-full"
        />

      </div>

    </header>
  );
}
