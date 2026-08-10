import {prisma} from "../config/database.js"

const getCurrentAvailabilitySlot = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Dar_es_Salaam",
        weekday: "long",
        hour: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());
    const part = (type) => parts.find((item) => item.type === type)?.value;
    const hour = Number(part("hour"));

    if (!Number.isInteger(hour) || hour < 8 || hour >= 16) {
        return { dayOfWeek: part("weekday"), timeSlot: null };
    }

    return {
        dayOfWeek: part("weekday"),
        timeSlot: `${String(hour).padStart(2, "0")}:00-${String(hour + 1).padStart(2, "0")}:00`,
    };
};

export const getAllLecturers = async (req, res) => {
  try {
    const currentSlot = getCurrentAvailabilitySlot();

    // 1. If it's a weekend or outside 8 AM - 4 PM, skip availability entirely
    if (!currentSlot || !currentSlot.timeSlot) {
      const lecturers = await prisma.lecturerProfile.findMany({
        select: {
          id: true,
          department: true,
          specialization: true,
          officeLocation: true,
          user: { select: { fullName: true } },
        },
        orderBy: { user: { fullName: "asc" } },
      });

      // Outside working hours, everyone is safely marked offline
      return res.status(200).json(
        lecturers.map((lecturer) => ({ ...lecturer, isOnline: false }))
      );
    }

    // 2. If inside working hours, execute the full availability query
    const lecturers = await prisma.lecturerProfile.findMany({
      select: {
        id: true,
        department: true,
        specialization: true,
        officeLocation: true,
        user: { select: { fullName: true } },
        availability: {
          where: {
            dayOfWeek: currentSlot.dayOfWeek,
            timeSlot: currentSlot.timeSlot,
            isAvailable: true,
          },
          select: { id: true },
        },
      },
      orderBy: { user: { fullName: "asc" } },
    });

    // Format output for active operational hours
    return res.status(200).json(
      lecturers.map(({ availability, ...lecturer }) => ({
        ...lecturer,
        isOnline: Array.isArray(availability) && availability.length > 0,
      }))
    );

  } catch (error) {
    // This logs the exact runtime error message straight into your Render dashboard logs
    console.error("CRITICAL GET_ALL_LECTURERS EXCEPTION:", error);

    return res.status(500).json({ message: "Server database error" });
  }
};
