import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Topbar from "../components/dashboard/Topbar";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from "../services/notificationService";

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [markingAll, setMarkingAll] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ================================
     LOAD NOTIFICATIONS
  ================================= */

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
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

  /* ================================
     MARK ONE AS READ
  ================================= */

  const handleMarkRead =
    async (
      notification: Notification
    ) => {
      if (notification.read) {
        return;
      }

      try {
        const updated =
          await markNotificationRead(
            notification._id
          );

        setNotifications(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                notification._id
                  ? {
                      ...item,
                      ...updated,
                      read: true,
                    }
                  : item
            )
        );
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error
        );
      }
    };

  /* ================================
     MARK ALL AS READ
  ================================= */

  const handleMarkAllRead =
    async () => {
      const unreadCount =
        notifications.filter(
          (item) => !item.read
        ).length;

      if (unreadCount === 0) {
        return;
      }

      try {
        setMarkingAll(true);

        await markAllNotificationsRead();

        setNotifications(
          (previous) =>
            previous.map(
              (item) => ({
                ...item,
                read: true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Failed to mark all notifications as read:",
          error
        );
      } finally {
        setMarkingAll(false);
      }
    };

  /* ================================
     HANDLE NOTIFICATION CLICK
  ================================= */

  const handleNotificationClick =
    async (
      notification: Notification
    ) => {
      await handleMarkRead(
        notification
      );

      if (
        notification.task?._id
      ) {
        navigate(
          `/tasks/${notification.task._id}`
        );

        return;
      }

      if (
        notification.project?._id
      ) {
        navigate(
          `/projects/${notification.project._id}`
        );

        return;
      }
    };

  /* ================================
     NOTIFICATION ICON
  ================================= */

  const getNotificationIcon =
    (
      type: Notification["type"]
    ) => {
      switch (type) {
        case "task":
          return "✓";

        case "project":
          return "📁";

        case "comment":
          return "💬";

        case "team":
          return "👥";

        case "system":
          return "⚙";

        default:
          return "🔔";
      }
    };

  /* ================================
     NOTIFICATION COLOR
  ================================= */

  const getNotificationColor =
    (
      type: Notification["type"]
    ) => {
      switch (type) {
        case "task":
          return "bg-blue-500/15 text-blue-400";

        case "project":
          return "bg-purple-500/15 text-purple-400";

        case "comment":
          return "bg-green-500/15 text-green-400";

        case "team":
          return "bg-orange-500/15 text-orange-400";

        case "system":
          return "bg-zinc-500/15 text-zinc-400";

        default:
          return "bg-blue-500/15 text-blue-400";
      }
    };

  /* ================================
     TIME FORMAT
  ================================= */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleString();
  };

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <Topbar />

      <main className="mx-auto max-w-5xl p-6 md:p-8">

        {/* ================================
            HEADER
        ================================= */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>

            <h1 className="text-3xl font-bold">
              Notifications
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Stay updated with activity across DevForge.
            </p>

          </div>

          <button
            onClick={
              handleMarkAllRead
            }
            disabled={
              markingAll ||
              unreadCount === 0
            }
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAll
              ? "Marking..."
              : "Mark all as read"}
          </button>

        </div>

        {/* ================================
            SUMMARY
        ================================= */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <p className="text-sm text-zinc-500">
              Total
            </p>

            <p className="mt-1 text-2xl font-bold text-white">
              {notifications.length}
            </p>

          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">

            <p className="text-sm text-zinc-500">
              Unread
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-400">
              {unreadCount}
            </p>

          </div>

        </div>

        {/* ================================
            ERROR
        ================================= */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ================================
            NOTIFICATIONS
        ================================= */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">

          {loading ? (

            <div className="p-10 text-center text-sm text-zinc-500">
              Loading notifications...
            </div>

          ) : notifications.length ===
            0 ? (

            <div className="p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">
                🔔
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                No notifications
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                You're all caught up.
              </p>

            </div>

          ) : (

            <div>

              {notifications.map(
                (
                  notification,
                  index
                ) => (

                  <button
                    key={
                      notification._id
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                    className={`flex w-full items-start gap-4 p-5 text-left transition hover:bg-zinc-800/60 ${
                      index !==
                      notifications.length -
                        1
                        ? "border-b border-zinc-800"
                        : ""
                    } ${
                      !notification.read
                        ? "bg-blue-500/[0.04]"
                        : ""
                    }`}
                  >

                    {/* ICON */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-sm leading-6 text-zinc-300">

                            {notification.actor
                              ?.name && (
                              <span className="font-semibold text-white">
                                {
                                  notification
                                    .actor
                                    .name
                                }{" "}
                              </span>
                            )}

                            {
                              notification.message
                            }

                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {formatDate(
                              notification.createdAt
                            )}
                          </p>

                        </div>

                        {!notification.read && (
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                        )}

                      </div>

                      {/* TASK */}

                      {notification.task && (
                        <div className="mt-3 inline-flex rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400">

                          Task:{" "}
                          <span className="ml-1 font-medium text-zinc-200">
                            {
                              notification
                                .task
                                .title
                            }
                          </span>

                        </div>
                      )}

                      {/* PROJECT */}

                      {notification.project && (
                        <div className="mt-2 inline-flex rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400">

                          Project:{" "}
                          <span className="ml-1 font-medium text-zinc-200">
                            {
                              notification
                                .project
                                .name
                            }
                          </span>

                        </div>
                      )}

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}