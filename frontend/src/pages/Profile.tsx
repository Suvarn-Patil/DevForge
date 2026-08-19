import {
  useEffect,
  useState,
} from "react";

import {
  Mail,
  Calendar,
  Settings as SettingsIcon,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
  getCurrentUser,
  type User,
} from "../services/userService";

function getInitials(
  name: string
) {
  return name
    .trim()
    .split(/\s+/)
    .map(
      (part) =>
        part.charAt(0).toUpperCase()
    )
    .slice(0, 2)
    .join("");
}

function formatDate(
  date?: string
) {
  if (!date) {
    return "Unknown";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

export default function Profile() {
  const navigate =
    useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCurrentUser();

        setUser(data);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        setError(
          "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="p-8">
          {/* HEADER */}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Profile
              </h1>

              <p className="mt-2 text-zinc-400">
                View your DevForge account information.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  "/settings"
                )
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              <SettingsIcon
                size={18}
              />
              Edit Profile
            </button>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              Loading profile...
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
              {error}
            </div>
          )}

          {/* PROFILE */}

          {!loading &&
            !error &&
            user && (
              <div className="mt-8 max-w-4xl">
                {/* PROFILE CARD */}

                <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                    {/* AVATAR */}

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white ring-4 ring-blue-500/10">
                      {getInitials(
                        user.name
                      )}
                    </div>

                    {/* USER */}

                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {user.name}
                      </h2>

                      <p className="mt-2 text-zinc-400">
                        DevForge Developer
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Mail
                            size={16}
                            className="text-blue-400"
                          />

                          {user.email}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Calendar
                            size={16}
                            className="text-blue-400"
                          />

                          Joined{" "}
                          {formatDate(
                            user.createdAt
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ACCOUNT INFORMATION */}

                <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                  <h2 className="text-xl font-semibold text-white">
                    Account Information
                  </h2>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        Full Name
                      </p>

                      <p className="mt-2 font-medium text-white">
                        {user.name}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        Email
                      </p>

                      <p className="mt-2 break-all font-medium text-white">
                        {user.email}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        Account ID
                      </p>

                      <p className="mt-2 break-all font-mono text-xs text-zinc-400">
                        {user._id}
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                      <p className="text-sm text-zinc-500">
                        Member Since
                      </p>

                      <p className="mt-2 font-medium text-white">
                        {formatDate(
                          user.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
