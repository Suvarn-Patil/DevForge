import Activity from "../models/Activity";

type ActivityAction =
  | "created_task"
  | "updated_task"
  | "changed_status"
  | "deleted_task"
  | "created_comment"
  | "updated_comment"
  | "deleted_comment";

export const createActivity = async (
  project: string,
  user: string,
  action: ActivityAction,
  description: string,
  task?: string
) => {
  console.log("========== CREATE ACTIVITY ==========");
  console.log("project:", project);
  console.log("user:", user);
  console.log("action:", action);
  console.log("description:", description);
  console.log("task:", task);

  const activity = await Activity.create({
    project,
    user,
    action,
    description,
    task,
  });

  console.log("ACTIVITY CREATED:", activity._id);
  console.log("=====================================");

  return activity;
};

export const getProjectActivities = async (
  project: string
) => {
  console.log("========== GET ACTIVITIES ==========");
  console.log("project:", project);

  const activities = await Activity.find({
    project,
  })
    .populate("user", "name email")
    .populate("task", "title")
    .sort({ createdAt: -1 })
    .limit(50);

  console.log(
    "ACTIVITIES FOUND:",
    activities.length
  );
  console.log("===================================");

  return activities;
};
