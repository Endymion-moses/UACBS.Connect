import { useCallback, useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const timeAgo = (date) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) === 1 ? "" : "s"} ago`;
  return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) === 1 ? "" : "s"} ago`;
};

const mapNotification = (notification) => ({ ...notification, timeAgo: timeAgo(notification.createdAt) });

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    const response = await fetch(`${apiBaseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not load notifications.");
    setNotifications(data.notifications.map(mapNotification));
    setUnreadCount(data.unreadCount);
  }, []);

  useEffect(() => {
    const refresh = () => loadNotifications().catch(() => {});
    refresh();
    window.addEventListener("notifications-updated", refresh);
    const intervalId = window.setInterval(refresh, 30000);
    return () => {
      window.removeEventListener("notifications-updated", refresh);
      window.clearInterval(intervalId);
    };
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    const response = await fetch(`${apiBaseUrl}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Could not mark notification as read.");
    await loadNotifications();
    window.dispatchEvent(new Event("notifications-updated"));
  };

  return { notifications, unreadCount, markAsRead, loadNotifications };
};
