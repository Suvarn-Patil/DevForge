import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(
        email,
        password
      );

      localStorage.setItem(
        "token",
        data.token
      );

      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

        <h1 className="text-4xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mt-2 text-zinc-400">
          Login to continue using DevForge.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-6"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-8 text-center text-zinc-400">

          Don't have an account?

          <Link
            to="/register"
            className="ml-2 text-blue-500 hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}