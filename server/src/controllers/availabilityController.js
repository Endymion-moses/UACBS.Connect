import {prisma} from "../config/database.js";
import createDefaultSlots from "../utils/availability.js";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
];

// fetching lecturers availability and also creating availability
export const  getAvailability = async (req, res) =>{
     const {id} = req.params ;
     const lecturerId = Number(id);

     try {
           if (!Number.isInteger(lecturerId) || lecturerId < 1) {
             return res.status(400).json({ message: "A valid lecturer id is required" });
           }

           const lecturer = await prisma.lecturerProfile.findUnique({ where: { id: lecturerId } });
           if (!lecturer) {
             return res.status(404).json({ message: "Lecturer not found" });
           }

           let availability = await prisma.lecturerAvailability.findMany({
            where :{lecturerId},
            orderBy: [{ dayOfWeek: "asc" }, { timeSlot: "asc" }],
           });


           if (availability.length === 0){
              await createDefaultSlots(lecturerId);
              availability = await prisma.lecturerAvailability.findMany({
                where : {lecturerId},
                orderBy: [{ dayOfWeek: "asc" }, { timeSlot: "asc" }],
              });
           }

           res.json(availability);

     } catch (error) {
        console.error("Failed to fetch lecturer availability", error);
        res.status(500).json({message : "Failed to fetch availability"});

     }
}

export const updateMyAvailability = async (req, res) => {
  try {
    if (req.user.role !== "LECTURER") {
      return res.status(403).json({ message: "Only lecturers can update availability" });
    }

    const { slots } = req.body;
    if (!Array.isArray(slots)) {
      return res.status(400).json({ message: "slots must be an array" });
    }

    const invalidSlot = slots.find(({ dayOfWeek, timeSlot, isAvailable }) =>
      !DAYS.includes(dayOfWeek) || !TIME_SLOTS.includes(timeSlot) || typeof isAvailable !== "boolean"
    );
    if (invalidSlot) {
      return res.status(400).json({ message: "One or more availability slots are invalid" });
    }

    const keys = new Set(slots.map(({ dayOfWeek, timeSlot }) => `${dayOfWeek}|${timeSlot}`));
    if (keys.size !== slots.length) {
      return res.status(400).json({ message: "Availability slots must not be duplicated" });
    }

    const lecturer = await prisma.lecturerProfile.findUnique({ where: { userId: req.user.id } });
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer profile not found" });
    }

    await createDefaultSlots(lecturer.id);
    await prisma.$transaction(slots.map(({ dayOfWeek, timeSlot, isAvailable }) =>
      prisma.lecturerAvailability.update({
        where: { lecturerId_dayOfWeek_timeSlot: { lecturerId: lecturer.id, dayOfWeek, timeSlot } },
        data: { isAvailable },
      })
    ));

    const availability = await prisma.lecturerAvailability.findMany({
      where: { lecturerId: lecturer.id },
      orderBy: [{ dayOfWeek: "asc" }, { timeSlot: "asc" }],
    });
    return res.status(200).json(availability);
  } catch (error) {
    console.error("Failed to update lecturer availability", error);
    return res.status(500).json({ message: "Failed to save availability" });
  }
};

