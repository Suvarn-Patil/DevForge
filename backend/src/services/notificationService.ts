import Notification from "../models/Notification";

type NotificationType =
  | "task"
  | "project"
  | "comment"
  | "team"
  | "system";

export const createNotification = async (
  recipient: string,
  type: NotificationType,
  message: string,
  actor?: string,
  project?: string,
  task?: string
) => {
  const notification =
    await Notification.create({
      recipient,
      actor,
      project,
      task,
      type,
      message,
    });

  return notification;
};

export const getUserNotifications = async (
  userId: string,
  unreadOnly = false
) => {
  const filter = {
    recipient: userId,
    ...(unreadOnly
      ? { read: false }
      : {}),
  };

  const notifications =
    await Notification.find(filter)
      .populate(
        "actor",
        "name email"
      )
      .populate(
        "project",
        "name"
      )
      .populate(
        "task",
        "title"
      )
      .sort({
        createdAt: -1,
      })
      .limit(50);

  return notifications;
};

export const markNotificationAsRead =
  async (
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

export const markAllNotificationsAsRead =
  async (userId: string) => {
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
