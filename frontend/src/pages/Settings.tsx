import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
  changePassword,
  getCurrentUser,
  updateCurrentUser,
} from "../services/userService";

export default function Settings() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* ================================
     LOAD USER
  ================================= */

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getCurrentUser();

        setName(data.name || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error(
          "Failed to load account:",
          error
        );

        setError(
          "Failed to load account information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* ================================
     SAVE PROFILE
  ================================= */

  const handleSaveProfile =
    async () => {
      if (!name.trim()) {
        setError(
          "Name cannot be empty."
        );
        setMessage("");
        return;
      }

      if (!email.trim()) {
        setError(
          "Email cannot be empty."
        );
        setMessage("");
        return;
      }

      try {
        setSavingProfile(true);
        setError("");
        setMessage("");

        const updated =
          await updateCurrentUser(
            name.trim(),
            email.trim()
          );

        setName(updated.name);
        setEmail(updated.email);

        setMessage(
          "Profile updated successfully."
        );
      } catch (error: any) {
        console.error(
          "Failed to update profile:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to update profile."
        );
      } finally {
        setSavingProfile(false);
      }
    };

  /* ================================
     CHANGE PASSWORD
  ================================= */

  const handleChangePassword =
    async () => {
      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        setError(
          "Please fill in all password fields."
        );
        setMessage("");
        return;
      }

      if (
        newPassword.length < 6
      ) {
        setError(
          "New password must be at least 6 characters."
        );
        setMessage("");
        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "New passwords do not match."
        );
        setMessage("");
        return;
      }

      try {
        setChangingPassword(true);
        setError("");
        setMessage("");

        const response =
          await changePassword(
            currentPassword,
            newPassword
          );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setMessage(
          response?.message ||
            "Password changed successfully."
        );
      } catch (error: any) {
        console.error(
          "Failed to change password:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to change password."
        );
      } finally {
        setChangingPassword(false);
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
     LOADING
  ================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <main className="p-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              Loading settings...
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
              Settings
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage your account and security settings.
            </p>
          </div>

          {/* SUCCESS */}

          {message && (
            <div className="mt-6 max-w-3xl rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
              {message}
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-6 max-w-3xl rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* PROFILE */}

          <section className="mt-8 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-xl font-semibold text-white">
              Profile
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update your basic account information.
            </p>

            <div className="mt-6 space-y-5">
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
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-white outline-none focus:border-blue-500"
                />

                <p className="mt-2 text-xs text-zinc-600">
                  This email is used to log in to DevForge.
                </p>
              </div>

              {/* SAVE */}

              <div className="flex justify-end">
                <button
                  onClick={
                    handleSaveProfile
                  }
                  disabled={
                    savingProfile ||
                    !name.trim() ||
                    !email.trim()
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingProfile
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </section>

          {/* PASSWORD */}

          <section className="mt-6 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="text-xl font-semibold text-white">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Change your DevForge account password.
            </p>

            <div className="mt-6 space-y-5">
              {/* CURRENT */}

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Current Password
                </label>

                <input
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* NEW */}

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Minimum 6 characters"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* CONFIRM */}

              <div>
                <label className="block text-sm font-medium text-zinc-300">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Repeat new password"
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3.5 text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* CHANGE */}

              <div className="flex justify-end">
                <button
                  onClick={
                    handleChangePassword
                  }
                  disabled={
                    changingPassword
                  }
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                </button>
              </div>
            </div>
          </section>

          {/* ACCOUNT */}

          <section className="mt-6 max-w-3xl rounded-2xl border border-red-500/20 bg-zinc-900 p-8">
            <h2 className="text-xl font-semibold text-white">
              Account
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Sign out of your DevForge account.
            </p>

            <button
              onClick={
                handleLogout
              }
              className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Logout
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
