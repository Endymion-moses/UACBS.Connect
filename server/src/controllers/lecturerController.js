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
        const lecturers = await prisma.lecturerProfile.findMany({
            select: {
                id: true,
                department: true,
                specialization: true,
                officeLocation: true,
                user: {
                    select: {
                        fullName: true,
                    },
                },
                availability: currentSlot.timeSlot ? {
                    where: {
                        dayOfWeek: currentSlot.dayOfWeek,
                        timeSlot: currentSlot.timeSlot,
                        isAvailable: true,
                    },
                    select: { id: true },
                } : false,
            },
            orderBy: {
                user: {
                    fullName: "asc",
                },
            },
        });

        return res.status(200).json(lecturers.map(({ availability, ...lecturer }) => ({
            ...lecturer,
            isOnline: availability.length > 0,
        })));


    } catch (error) {
       return res.status(500).json({message :"Server database error "});
    }
}
