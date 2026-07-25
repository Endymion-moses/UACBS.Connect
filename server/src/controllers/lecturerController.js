import {prisma} from "../config/database.js"

export const getAllLecturers = async (req, res) => {
    try {
        const lecturers = await prisma.lecturerProfile.findMany();

        return res.status (200).json(lecturers);


    } catch (error) {
       return res.status(500).json({message :"Server database error "});
    }
}