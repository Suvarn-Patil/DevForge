import { useEffect, useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import OverviewCards from "../components/dashboard/OverviewCards";
import RecentProjects from "../components/dashboard/RecentProjects";
import AIInsights from "../components/dashboard/AIInsights";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";

import {
  getCurrentUser,
} from "../services/authService";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data =
          await getCurrentUser();

        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-8">

          <h1 className="text-4xl font-bold text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-zinc-400">
            Welcome back 👋{" "}
            {user?.name}
          </p>

          <div className="mt-8">
            <OverviewCards />
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-2">

            <RecentProjects />

            <AIInsights />

          </div>

          <div className="mt-8">

            <UpcomingDeadlines />

          </div>

        </main>

      </div>

    </div>
  );
}