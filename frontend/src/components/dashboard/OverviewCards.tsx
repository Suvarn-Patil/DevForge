import { useEffect, useState } from "react";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import { getProjects } from "../../services/projectService";
import {
  getTasks,
  type Task,
} from "../../services/taskService";

import api from "../../api/axios";

export default function OverviewCards() {
  const [projectCount, setProjectCount] =
    useState(0);

  const [completedCount, setCompletedCount] =
    useState(0);

  const [pendingCount, setPendingCount] =
    useState(0);

  const [teamMemberCount, setTeamMemberCount] =
    useState(1);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          projects,
          tasks,
        ] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        setProjectCount(
          projects.length
        );

        setCompletedCount(
          tasks.filter(
            (task: Task) =>
              task.status === "done"
          ).length
        );

        setPendingCount(
          tasks.filter(
            (task: Task) =>
              task.status !== "done"
          ).length
        );

        /*
         * Try to get the user's team/member
         * information if the endpoint exists.
         */
        try {
          const response =
            await api.get(
              "/teams"
            );

          if (
            Array.isArray(
              response.data
            )
          ) {
            const uniqueUsers =
              new Set<string>();

            response.data.forEach(
              (team: any) => {
                if (
                  Array.isArray(
                    team.members
                  )
                ) {
                  team.members.forEach(
                    (member: any) => {
                      const memberId =
                        typeof member ===
                        "string"
                          ? member
                          : member?._id;

                      if (memberId) {
                        uniqueUsers.add(
                          memberId
                        );
                      }
                    }
                  );
                }
              }
            );

            if (
              uniqueUsers.size >
              0
            ) {
              setTeamMemberCount(
                uniqueUsers.size
              );
            }
          }
        } catch {
          /*
           * Keep the fallback value
           * if the team response isn't
           * available.
           */
          setTeamMemberCount(1);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
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
      value: teamMemberCount,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700"
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-zinc-400">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-white">
                  {loading
                    ? "—"
                    : card.value}
                </h2>

              </div>

              <div className="rounded-xl bg-blue-500/10 p-3">

                <Icon
                  size={28}
                  className="text-blue-500"
                />

              </div>

            </div>

          </div>
        );
      })}

    </div>
  );
}