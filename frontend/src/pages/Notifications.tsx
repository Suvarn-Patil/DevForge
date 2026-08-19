import { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notificationService";

import type {
  Notification,
} from "../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getNotifications();

      setNotifications(data);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );

      setError(
        "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (
    notificationId: string
  ) => {
    try {
      await markNotificationRead(
        notificationId
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const unreadCount =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl p-8">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Notifications
            </h1>

            <p className="mt-2 text-zinc-400">
              Stay updated with activity in DevForge.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchNotifications}
              className="rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white transition hover:border-blue-500 hover:bg-zinc-900"
            >
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
              <div className="text-5xl">
                🔔
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No notifications yet
              </h2>

              <p className="mt-2 text-zinc-400">
                Notifications will appear here when something happens.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(
                (notification) => (
                  <div
                    key={notification._id}
                    className={`rounded-2xl border p-6 transition ${
                      notification.read
                        ? "border-zinc-800 bg-zinc-900"
                        : "border-blue-500/40 bg-blue-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">

                      <div className="flex gap-4">

                        <div className="mt-1 text-2xl">
                          {notification.type ===
                          "task"
                            ? "📋"
                            : notification.type ===
                              "comment"
                            ? "💬"
                            : notification.type ===
                              "team"
                            ? "👥"
                            : "🔔"}
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-white">
                              {notification.message}
                            </h3>

                            {!notification.read && (
                              <span className="rounded-full bg-blue-500 px-2 py-1 text-xs font-semibold text-white">
                                New
                              </span>
                            )}
                          </div>

                          {notification.actor && (
                            <p className="mt-2 text-sm text-zinc-400">
                              By{" "}
                              {notification.actor.name}
                            </p>
                          )}

                          {notification.project && (
                            <p className="mt-1 text-sm text-zinc-500">
                              Project:{" "}
                              {notification.project.name}
                            </p>
                          )}

                          {notification.createdAt && (
                            <p className="mt-2 text-xs text-zinc-600">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <button
                          onClick={() =>
                            handleRead(
                              notification._id
                            )
                          }
                          className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500 hover:text-white"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
