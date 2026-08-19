import api from "../api/axios";

export interface Notification {
  _id: string;

  recipient: string;

  actor?: {
    _id: string;
    name: string;
    email: string;
  };

  project?: {
    _id: string;
    name: string;
  };

  task?: {
    _id: string;
    title: string;
  };

  type:
    | "task"
    | "project"
    | "comment"
    | "team"
    | "system";

  message: string;

  read: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export const getNotifications =
  async (
    unreadOnly = false
  ): Promise<Notification[]> => {
    const response =
      await api.get(
        "/notifications",
        {
          params: unreadOnly
            ? { unread: true }
            : undefined,
        }
      );

    return response.data;
  };

export const markNotificationRead =
  async (
    notificationId: string
  ) => {
    const response =
      await api.patch(
        `/notifications/${notificationId}/read`
      );

    return response.data;
  };

export const markAllNotificationsRead =
  async () => {
    const response =
      await api.patch(
        "/notifications/read-all"
      );

    return response.data;
  };
