import { Bell, Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">

      <div className="flex items-center gap-4">

        <Search className="text-zinc-500" />

        <input
          placeholder="Search..."
          className="bg-transparent text-white outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell className="cursor-pointer text-zinc-400 hover:text-white" />

        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="h-11 w-11 rounded-full"
        />

      </div>

    </header>
  );
}