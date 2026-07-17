import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  KanbanSquare,
  Bot,
  User,
  Settings,
} from "lucide-react";

const menu = [
  {
    icon: LayoutDashboard,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: KanbanSquare,
    name: "Kanban",
    path: "/kanban",
  },
  {
    icon: Bot,
    name: "AI Assistant",
    path: "/ai",
  },
  {
    icon: User,
    name: "Profile",
    path: "/profile",
  },
  {
    icon: Settings,
    name: "Settings",
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950">

      <div className="border-b border-zinc-800 p-6">

        <h1 className="text-3xl font-bold text-blue-500">
          DevForge
        </h1>

      </div>

      <div className="mt-8 flex flex-col gap-2 px-4">

        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center gap-4 rounded-xl px-4 py-3 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
          >
            <item.icon size={22} />
            {item.name}
          </Link>
        ))}

      </div>

    </aside>
  );
}