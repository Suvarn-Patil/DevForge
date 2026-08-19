import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { getProjects } from "../../services/projectService";
import {
  getTasks,
  type Task,
} from "../../services/taskService";

export default function AIInsights() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, taskData] =
          await Promise.all([
            getProjects(),
            getTasks(),
          ]);

        setProjects(projectData);
        setTasks(taskData);
      } catch (error) {
        console.error(
          "Failed to generate insights:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const completed = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const pending = tasks.filter(
    (task) => task.status !== "done"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "inprogress"
  ).length;

  const highPriority = tasks.filter(
    (task) =>
      task.priority === "high" &&
      task.status !== "done"
  ).length;

  const insights: string[] = [];

  if (tasks.length === 0) {
    insights.push(
      "Create your first task to start getting project insights."
    );
  } else {
    if (completed > 0) {
      insights.push(
        `You have completed ${completed} ${
          completed === 1 ? "task" : "tasks"
        }.`
      );
    }

    if (inProgress > 0) {
      insights.push(
        `${inProgress} ${
          inProgress === 1
            ? "task is"
            : "tasks are"
        } currently in progress.`
      );
    }

    if (highPriority > 0) {
      insights.push(
        `${highPriority} high-priority ${
          highPriority === 1
            ? "task needs"
            : "tasks need"
        } attention.`
      );
    }

    if (pending === 0) {
      insights.push(
        "All current tasks are completed. Great work!"
      );
    } else {
      insights.push(
        `${pending} ${
          pending === 1
            ? "task remains"
            : "tasks remain"
        } unfinished.`
      );
    }

    if (projects.length > 0) {
      insights.push(
        `You currently have ${projects.length} ${
          projects.length === 1
            ? "active project"
            : "active projects"
        }.`
      );
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Sparkles className="text-blue-500" />

        <h2 className="text-2xl font-bold text-white">
          AI Insights
        </h2>
      </div>

      <p className="mt-2 text-sm text-zinc-500">
        Insights based on your current project data.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-xl bg-zinc-950 p-4 text-zinc-400">
            Analyzing your workspace...
          </div>
        ) : (
          insights.map((insight, index) => (
            <div
              key={index}
              className="rounded-xl bg-zinc-950 p-4"
            >
              <p className="text-zinc-300">
                {insight}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}