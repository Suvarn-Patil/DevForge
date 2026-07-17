import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-500"
        >
          DevForge
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/login" className="text-zinc-400 hover:text-white">
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}