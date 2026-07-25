import {prisma} from "../config/database.js";

const createDefaultSlots = async (lecturerId) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00",
    "11:00-12:00", "12:00-13:00", "13:00-14:00",
    "14:00-15:00", "15:00-16:00"
  ];

  await prisma.lecturerAvailability.createMany({
    data: days.flatMap((day) => hours.map((timeSlot) => ({
      lecturerId,
      dayOfWeek: day,
      timeSlot,
      isAvailable: false,
    }))),
    skipDuplicates: true,
  });
}

export default createDefaultSlots;
