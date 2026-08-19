import {
  LayoutDashboard,
  FolderKanban,
  Columns3,
  Users,
  Bot,
  User,
  Settings,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Teams",
    path: "/teams",
    icon: Users,
  },
  {
    name: "Kanban",
    path: "/kanban",
    icon: Columns3,
  },
  {
    name: "AI Assistant",
    path: "/ai",
    icon: Bot,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-950">

      {/* Logo */}

      <div className="flex h-20 items-center border-b border-zinc-800 px-6">
        <Link
          to="/dashboard"
          className="text-3xl font-bold text-blue-500"
        >
          DevForge
        </Link>
      </div>

      {/* Navigation */}

      <nav className="p-5">

        <div className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(
                `${item.path}/`
              );

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-500/10 text-blue-500"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={22} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </div>

      </nav>

    </aside>
  );
}
