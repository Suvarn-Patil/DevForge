import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import api from "../api/axios";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function Profile() {
  const [user, setUser] =
    useState<User | null>(null);

  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ================================
     LOAD PROFILE
  ================================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get("/users/me");

        const data =
          response.data;

        setUser(data);
        setName(data.name || "");
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

    fetchProfile();
  }, []);

  /* ================================
     SAVE PROFILE
  ================================= */

  const handleSave = async () => {
    if (!name.trim()) {
      setError(
        "Name cannot be empty."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await api.patch(
          "/users/me",
          {
            name: name.trim(),
          }
        );

      const updatedUser =
        response.data;

      setUser(updatedUser);
      setName(
        updatedUser.name || ""
      );

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setError(
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================
     LOGOUT
  ================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/login";
  };

  /* ================================
     INITIAL LOADING
  ================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-950">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Topbar />

          <main className="p-8">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
              Loading profile...
            </div>

          </main>

        </div>

      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="p-8">

          {/* HEADER */}

          <div>

            <h1 className="text-4xl font-bold text-white">
              Profile
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage your DevForge profile.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {message && (
            <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
              {message}
            </div>
          )}

          {/* PROFILE CARD */}

          <div className="mt-8 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

            {/* PROFILE HEADER */}

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">

                {user?.name
                  ?.charAt(0)
                  .toUpperCase() ||
                  "U"}

              </div>

              <div>

                <h2 className="text-3xl font-bold text-white">
                  {user?.name ||
                    "User"}
                </h2>

                <p className="mt-1 text-zinc-400">
                  {user?.email ||
                    ""}
                </p>

              </div>

            </div>

            {/* FORM */}

            <div className="mt-10 space-y-6">

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-zinc-300">
                  Full Name
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-white outline-none focus:border-blue-500"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium text-zinc-300">
                  Email
                </label>

                <input
                  value={
                    user?.email ||
                    ""
                  }
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-zinc-500 outline-none"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  Email cannot be changed here.
                </p>

              </div>

              {/* SAVE */}

              <div className="flex justify-end">

                <button
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving ||
                    !name.trim()
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </div>

          </div>

          {/* ACCOUNT */}

          <div className="mt-6 max-w-3xl rounded-2xl border border-red-500/20 bg-zinc-900 p-8">

            <h2 className="text-lg font-semibold text-white">
              Account
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Sign out of your DevForge account.
            </p>

            <button
              onClick={
                handleLogout
              }
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20"
            >
              Logout
            </button>

          </div>

        </main>

      </div>

    </div>
  );
}