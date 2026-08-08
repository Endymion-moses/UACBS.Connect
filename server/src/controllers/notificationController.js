import { prisma } from "../config/database.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user.id, isRead: false } });
    return res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    return res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await prisma.notification.findFirst({ where: { id: Number(req.params.id), userId: req.user.id } });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    const updated = await prisma.notification.update({ where: { id: notification.id }, data: { isRead: true } });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user.id, isRead: false } });
    return res.json({ notification: updated, unreadCount });
  } catch (error) {
    console.error("Failed to update notification", error);
    return res.status(500).json({ message: "Failed to update notification" });
  }
};
