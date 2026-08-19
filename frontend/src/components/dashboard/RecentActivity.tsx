import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  CheckCircle2,
  CirclePlus,
  MessageSquare,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { getProjects } from "../../services/projectService";
import {
  getProjectActivities,
  type Activity as ActivityItem,
} from "../../services/activityService";

function activityIcon(action: string) {
  switch (action) {
    case "created_task":
      return CirclePlus;

    case "updated_task":
      return Pencil;

    case "changed_status":
      return CheckCircle2;

    case "deleted_task":
      return Trash2;

    case "created_comment":
    case "updated_comment":
    case "deleted_comment":
      return MessageSquare;

    default:
      return Activity;
  }
}

function formatTime(date?: string) {
  if (!date) {
    return "";
  }

  const value = new Date(date).getTime();
  const now = Date.now();

  const diff = Math.max(0, now - value);

  const minutes = Math.floor(
    diff / 60000
  );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(date).toLocaleDateString();
}

export default function RecentActivity() {
  const navigate = useNavigate();

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const projects =
          await getProjects();

        if (projects.length === 0) {
          setActivities([]);
          return;
        }

        const results =
          await Promise.all(
            projects.map((project) =>
              getProjectActivities(
                project._id
              )
            )
          );

        const combined =
          results
            .flat()
            .sort((a, b) => {
              const dateA = a.createdAt
                ? new Date(
                    a.createdAt
                  ).getTime()
                : 0;

              const dateB = b.createdAt
                ? new Date(
                    b.createdAt
                  ).getTime()
                : 0;

              return dateB - dateA;
            })
            .slice(0, 8);

        setActivities(combined);
      } catch (error) {
        console.error(
          "Failed to fetch activities:",
          error
        );

        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Latest activity across your projects
          </p>
        </div>

        <Activity
          size={24}
          className="text-blue-500"
        />

      </div>

      <div className="mt-6 space-y-3">

        {loading ? (
          <div className="rounded-xl bg-zinc-950 p-5 text-sm text-zinc-400">
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-xl bg-zinc-950 p-8 text-center">

            <Activity
              size={30}
              className="mx-auto text-zinc-700"
            />

            <p className="mt-3 text-sm text-zinc-400">
              No activity yet.
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Create or update a task to see activity here.
            </p>

          </div>
        ) : (
          activities.map((item) => {
            const Icon =
              activityIcon(
                item.action
              );

            const taskId =
              typeof item.task === "string"
                ? item.task
                : item.task?._id;

            return (
              <button
                key={item._id}
                onClick={() => {
                  if (taskId) {
                    navigate(
                      `/tasks/${taskId}`
                    );
                  }
                }}
                className={`flex w-full items-center gap-4 rounded-xl bg-zinc-950 p-4 text-left transition ${
                  taskId
                    ? "cursor-pointer hover:bg-zinc-800"
                    : "cursor-default"
                }`}
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Icon
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-medium text-white">
                    {item.description}
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="text-xs text-zinc-500">
                      {item.user?.name ||
                        "User"}
                    </span>

                    <span className="text-xs text-zinc-700">
                      •
                    </span>

                    <span className="text-xs text-zinc-600">
                      {formatTime(
                        item.createdAt
                      )}
                    </span>

                  </div>

                </div>

                {taskId && (
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-zinc-600"
                  />
                )}

              </button>
            );
          })
        )}

      </div>

    </section>
  );
}
