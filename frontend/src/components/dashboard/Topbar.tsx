import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
} from "../../services/notificationService";

export default function Topbar() {
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] =
    useState(0);

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

  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-8">

      {/* Search */}

      <div className="flex items-center gap-4">

        <Search
          size={20}
          className="text-zinc-500"
        />

        <input
          placeholder="Search..."
          className="bg-transparent text-white outline-none placeholder:text-zinc-600"
        />

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-6">

        {/* Notifications */}

        <button
          type="button"
          onClick={() =>
            navigate("/notifications")
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

        {/* Avatar */}

        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="h-11 w-11 rounded-full"
        />

      </div>

    </header>
  );
}
