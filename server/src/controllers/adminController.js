import { prisma } from "../config/database.js";

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getDashboardOverview = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Only administrators can view the dashboard" });

    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
      return { key: monthKey(date), month: new Intl.DateTimeFormat("en", { month: "short" }).format(date), bookings: 0 };
    });
    const monthlyMap = new Map(months.map((month) => [month.key, month]));
    const [users, lecturers, appointments, pendingAppointments, bookings, recentUsers] = await Promise.all([
      prisma.user.count(), prisma.lecturerProfile.count(), prisma.appointment.count(), prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.findMany({ select: { createdAt: true } }),
      prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, fullName: true, role: true, student: { select: { department: true, programme: true } }, lecturer: { select: { department: true } } } }),
    ]);
    bookings.forEach(({ createdAt }) => {
      const month = monthlyMap.get(monthKey(createdAt));
      if (month) month.bookings += 1;
    });
    return res.json({
      stats: { users, appointments, lecturers, pendingAppointments },
      monthlyBookings: months,
      recentUsers: recentUsers.map((user) => ({ id: user.id, fullName: user.fullName, role: user.role, department: user.student?.department || user.lecturer?.department || "Administration", programme: user.student?.programme || null })),
    });
  } catch (error) {
    console.error("Failed to load admin dashboard", error);
    return res.status(500).json({ message: "Could not load dashboard data" });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Only administrators can view system users" });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    });

    return res.json({ users });
  } catch (error) {
    console.error("Failed to load system users", error);
    return res.status(500).json({ message: "Could not load system users" });
  }
};
