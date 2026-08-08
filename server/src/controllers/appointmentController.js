import { prisma } from "../config/database.js";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"];
const includeDetails = {
  student: { include: { user: { select: { id: true, fullName: true, email: true } } } },
  lecturer: { include: { user: { select: { id: true, fullName: true } } } },
};

const weekdayForDate = (date) => DAYS[new Date(`${date}T12:00:00Z`).getUTCDay()];

export const createAppointment = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") return res.status(403).json({ message: "Only students can book appointments" });
    const { lecturerId, appointmentDate, timeSlot, reason } = req.body;
    if (!Number.isInteger(Number(lecturerId)) || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate || "") || !TIME_SLOTS.includes(timeSlot) || !reason?.trim()) {
      return res.status(400).json({ message: "Please provide a lecturer, valid date, available time slot, and reason" });
    }

    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { id: Number(lecturerId) } });
    if (!student || !lecturer) return res.status(404).json({ message: "Student or lecturer profile not found" });

    const isAvailable = await prisma.lecturerAvailability.findFirst({
      where: { lecturerId: lecturer.id, dayOfWeek: weekdayForDate(appointmentDate), timeSlot, isAvailable: true },
    });
    if (!isAvailable) return res.status(400).json({ message: "This lecturer is not available at the selected date and time" });

    const appointment = await prisma.$transaction(async (tx) => {
      const created = await tx.appointment.create({
        data: { studentId: student.id, lecturerId: lecturer.id, appointmentDate, timeSlot, reason: reason.trim() },
        include: includeDetails,
      });
      await tx.notification.create({
        data: {
          userId: lecturer.userId,
          type: "reminder",
          title: "New appointment request",
          message: `${created.student.user.fullName} requested ${appointmentDate} at ${timeSlot}.`,
        },
      });
      return created;
    });
    return res.status(201).json(appointment);
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ message: "This time slot has already been requested" });
    console.error("Failed to create appointment", error);
    return res.status(500).json({ message: "Failed to book appointment" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") return res.status(403).json({ message: "Only students can view their appointments" });
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ message: "Student profile not found" });
    const appointments = await prisma.appointment.findMany({ where: { studentId: student.id }, include: includeDetails, orderBy: { createdAt: "desc" } });
    return res.json(appointments);
  } catch (error) {
    console.error("Failed to fetch student appointments", error);
    return res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const getLecturerRequests = async (req, res) => {
  try {
    if (req.user.role !== "LECTURER") return res.status(403).json({ message: "Only lecturers can view appointment requests" });
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId: req.user.id } });
    if (!lecturer) return res.status(404).json({ message: "Lecturer profile not found" });
    const appointments = await prisma.appointment.findMany({ where: { lecturerId: lecturer.id }, include: includeDetails, orderBy: { createdAt: "desc" } });
    return res.json(appointments);
  } catch (error) {
    console.error("Failed to fetch lecturer requests", error);
    return res.status(500).json({ message: "Failed to fetch appointment requests" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== "LECTURER") return res.status(403).json({ message: "Only lecturers can update appointment requests" });
    const status = String(req.body.status || "").toUpperCase();
    if (!["APPROVED", "REJECTED"].includes(status)) return res.status(400).json({ message: "Status must be APPROVED or REJECTED" });
    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId: req.user.id } });
    if (!lecturer) return res.status(404).json({ message: "Lecturer profile not found" });
    const appointment = await prisma.appointment.findFirst({ where: { id: Number(req.params.id), lecturerId: lecturer?.id } });
    if (!appointment) return res.status(404).json({ message: "Appointment request not found" });
    if (appointment.status !== "PENDING") return res.status(400).json({ message: "Only pending requests can be updated" });
    const updated = await prisma.$transaction(async (tx) => {
      const changed = await tx.appointment.update({ where: { id: appointment.id }, data: { status }, include: includeDetails });
      await tx.notification.create({
        data: {
          userId: changed.student.user.id,
          type: status === "APPROVED" ? "approved" : "rejected",
          title: `Appointment ${status === "APPROVED" ? "approved" : "rejected"}`,
          message: `${changed.lecturer.user.fullName} ${status === "APPROVED" ? "approved" : "rejected"} your appointment for ${changed.appointmentDate} at ${changed.timeSlot}.`,
        },
      });
      return changed;
    });
    return res.json(updated);
  } catch (error) {
    console.error("Failed to update appointment request", error);
    return res.status(500).json({ message: "Failed to update appointment request" });
  }
};

export const cancelMyAppointment = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") return res.status(403).json({ message: "Only students can cancel appointments" });
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    const appointment = await prisma.appointment.findFirst({ where: { id: Number(req.params.id), studentId: student?.id } });
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.status !== "PENDING") return res.status(400).json({ message: "Only pending appointments can be cancelled" });
    return res.json(await prisma.appointment.update({ where: { id: appointment.id }, data: { status: "CANCELLED" }, include: includeDetails }));
  } catch (error) {
    console.error("Failed to cancel appointment", error);
    return res.status(500).json({ message: "Failed to cancel appointment" });
  }
};
