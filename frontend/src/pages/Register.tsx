import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await registerUser(
        name,
        email,
        password
      );

      alert("Account Created Successfully");

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-10">

        <h1 className="text-4xl font-bold text-white">
          Create Account
        </h1>

        <p className="mt-2 text-zinc-400">
          Start building with DevForge.
        </p>

        <form
          onSubmit={handleRegister}
          className="mt-10 space-y-6"
        >

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-white outline-none focus:border-blue-500"
          />

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
            className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500"
          >
            Create Account
          </button>

        </form>

        <p className="mt-8 text-center text-zinc-400">

          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-blue-500 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}