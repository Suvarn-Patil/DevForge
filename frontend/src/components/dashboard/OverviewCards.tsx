import { useEffect, useState } from "react";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import { getProjects } from "../../services/projectService";
import { getTasks } from "../../services/authService";

export default function OverviewCards() {
  const [projectCount, setProjectCount] =
    useState(0);

  const [completedCount, setCompletedCount] =
    useState(0);

  const [pendingCount, setPendingCount] =
    useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects =
          await getProjects();

        const tasks =
          await getTasks();

        setProjectCount(
          projects.length
        );

        setCompletedCount(
          tasks.filter(
            (task: any) =>
              task.status === "done"
          ).length
        );

        setPendingCount(
          tasks.filter(
            (task: any) =>
              task.status !== "done"
          ).length
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: "Projects",
      value: projectCount,
      icon: FolderKanban,
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: pendingCount,
      icon: Clock3,
    },
    {
      title: "Team Members",
      value: 1,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400">
                {card.title}
              </p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {card.value}
              </h2>
            </div>

            <card.icon
              size={36}
              className="text-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
}