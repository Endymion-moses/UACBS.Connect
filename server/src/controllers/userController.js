import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Supplied securely by the verifyToken guard check step
        const { fullName, email, password, role, profileInfo } = req.body;

        // 1. Basic structural input assertions
        if (!fullName || !email || !role) {
            return res.status(400).json({ error: "Missing required core identity profile properties." });
        }

        // 2. Tanzanian phone syntax validation block matching your frontend rules
        let formattedPhone = "";
        if (role === 'STUDENT' || role === 'LECTURER') {
            if (!profileInfo?.phoneNumber) {
                return res.status(400).json({ error: "Phone number tracking coordinates are missing." });
            }

            const cleanPhone = profileInfo.phoneNumber.replace(/[\s\-\(\)]/g, "");
            const isLocalValid = cleanPhone.startsWith('0') && cleanPhone.length === 10;
            const isInternationalValid = cleanPhone.startsWith('+255') && cleanPhone.length === 13;
            const isNoPlusValid = cleanPhone.startsWith('255') && cleanPhone.length === 12;

            if (!isLocalValid && !isInternationalValid && !isNoPlusValid) {
                return res.status(400).json({ error: "Invalid phone mapping lengths intercepted by security manager." });
            }

            if (cleanPhone.startsWith("0")) formattedPhone = "+255" + cleanPhone.substring(1);
            else if (!cleanPhone.startsWith("+")) formattedPhone = "+" + cleanPhone;
            else formattedPhone = cleanPhone;
        }

        // 3. Optional Password compilation layer logic block
        let hashedPassword = undefined;
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // 4. Fire dynamic transactional atomic updates to maintain consistency
        const updatedUser = await prisma.$transaction(async (tx) => {

            // Core authentication account properties adjustment compilation
            const userUpdateData = {
                fullName,
                email,
                ...(hashedPassword && { password: hashedPassword })
            };

            const user = await tx.user.update({
                where: { id: userId },
                data: userUpdateData
            });

            // Relational target sub-profile records alteration
            if (role === 'STUDENT') {
                await tx.studentProfile.update({
                    where: { userId: userId },
                    data: {
                        department: profileInfo.department,
                        programme: profileInfo.programme,
                        phoneNumber: formattedPhone
                    }
                });
            } else if (role === 'LECTURER') {
                await tx.lecturerProfile.update({
                    where: { userId: userId },
                    data: {
                        department: profileInfo.department,
                        specialization: profileInfo.specialization,
                        officeLocation: profileInfo.officeLocation,
                        phoneNumber: formattedPhone
                    }
                });
            }

            return user;
        });

        // 5. Fetch structural relations clean array payload to feed back to React states
        const populatedUser = await prisma.user.findUnique({
            where: { id: updatedUser.id },
            include: { student: true, lecturer: true, admin: true }
        });

        const { password: _, ...cleanResponseUser } = populatedUser;

        return res.status(200).json({
            message: "Profile properties modified successfully.",
            user: cleanResponseUser
        });

    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal transaction subsystem error occurred." });
    }
};
