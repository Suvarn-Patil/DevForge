import { useEffect, useState } from "react";

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import {
  getProjects,
} from "../../services/projectService";

import {
  getTasks,
  type Task,
} from "../../services/taskService";

import {
  getTeams,
} from "../../services/teamService";

export default function OverviewCards() {
  const [projectCount, setProjectCount] =
    useState(0);

  const [completedCount, setCompletedCount] =
    useState(0);

  const [pendingCount, setPendingCount] =
    useState(0);

  const [teamMemberCount, setTeamMemberCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        projects,
        tasks,
        teams,
      ] = await Promise.all([
        getProjects(),
        getTasks(),
        getTeams(),
      ]);

      /* ================================
         PROJECTS
      ================================= */

      setProjectCount(
        projects.length
      );

      /* ================================
         TASKS
      ================================= */

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

      /* ================================
         TEAM MEMBERS
      ================================= */

      const uniqueMembers =
        new Set<string>();

      teams.forEach((team) => {
        team.members?.forEach(
          (member) => {
            const userId =
              typeof member.user === "string"
                ? member.user
                : member.user._id;

            if (userId) {
              uniqueMembers.add(
                userId
              );
            }
          }
        );
      });

      setTeamMemberCount(
        uniqueMembers.size
      );

    } catch (error) {
      console.error(
        "Failed to load dashboard data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
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

              <Icon
                size={36}
                className="text-blue-500"
              />

            </div>

          </div>
        );
      })}

    </div>
  );
}
