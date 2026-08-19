import Notification from "../models/Notification";

export const createNotification = async (
  recipient: string,
  type:
    | "task"
    | "project"
    | "comment"
    | "team"
    | "system",
  message: string,
  actor?: string,
  project?: string,
  task?: string
) => {
  console.log("========== CREATE NOTIFICATION ==========");
  console.log("recipient:", recipient);
  console.log("type:", type);
  console.log("message:", message);
  console.log("actor:", actor);
  console.log("project:", project);
  console.log("task:", task);

  const notification =
    await Notification.create({
      recipient,
      actor,
      project,
      task,
      type,
      message,
    });

  console.log(
    "NOTIFICATION CREATED:",
    notification._id
  );
  console.log("==========================================");

  return notification;
};

export const getUserNotifications = async (
  userId: string,
  unreadOnly = false
) => {
  console.log("========== GET NOTIFICATIONS ==========");
  console.log("userId:", userId);
  console.log("unreadOnly:", unreadOnly);

  const filter: any = {
    recipient: userId,
  };

  if (unreadOnly) {
    filter.read = false;
  }

  const notifications =
    await Notification.find(filter)
      .populate("actor", "name email")
      .populate("project", "name")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(50);

  console.log(
    "NOTIFICATIONS FOUND:",
    notifications.length
  );
  console.log("=======================================");

  return notifications;
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: userId,
    },
    {
      read: true,
    },
    {
      new: true,
    }
  );
};

export const markAllNotificationsAsRead = async (
  userId: string
) => {
  return Notification.updateMany(
    {
      recipient: userId,
      read: false,
    },
    {
      read: true,
    }
  );
};
