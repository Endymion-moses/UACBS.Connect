import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


//register
const register = async (req, res) => {
    try {
        // Destructure all required inputs, including profileInfo
        const { fullName, email, password, role, profileInfo } = req.body;

        // 1. Basic validation
        if (!email || !password || !fullName || !role) {
            return res.status(400).json({ message: 'Missing required account fields' });
        }

        // 2. Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { email: email }
        });

        if (userExists) {
            return res.status(400).json({ error: "The account already exists" });
        }

        // 3. Phone Number Validation & Formatting for Student and Lecturer

        let formattedPhone = "";
        if (role === 'STUDENT' || role === 'LECTURER') {
            if (!profileInfo?.phoneNumber) {
                return res.status(400).json({ message: `Missing phone number for ${role.toLowerCase()} profile` });
            }

            // 1. Remove all spaces, dashes, or parentheses if any exist
            const cleanPhone = profileInfo.phoneNumber.replace(/[\s\-\(\)]/g, "");

            // 2. Clear out the old restrictive regex, and validate based on explicit lengths
            const isLocalValid = cleanPhone.startsWith('0') && cleanPhone.length === 10;
            const isInternationalValid = cleanPhone.startsWith('+255') && cleanPhone.length === 13;
            const isNoPlusValid = cleanPhone.startsWith('255') && cleanPhone.length === 12;

            if (!isLocalValid && !isInternationalValid && !isNoPlusValid) {
                return res.status(400).json({
                    error: "Invalid Tanzanian phone number format. Please ensure it is a valid 10-digit local number (e.g., 07...) or international number starting with +255."
                });
            }

            // 3. Normalize to international standard layout (+255XXXXXXXXX)
            if (cleanPhone.startsWith("0")) {
                formattedPhone = "+255" + cleanPhone.substring(1);
            } else if (!cleanPhone.startsWith("+")) {
                formattedPhone = "+" + cleanPhone;
            } else {
                formattedPhone = cleanPhone;
            }
        }


        // 4. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create User and Role Profile using a Transaction
        const finalUser = await prisma.$transaction(async (tx) => {
            // Create user (using fullName variable mapped to database 'fullName')
            const user = await tx.user.create({
                data: {
                    fullName: fullName,
                    email: email,
                    password: hashedPassword,
                    role: role
                }
            });

            // Create the specific profile depending on the assigned role
            if (role === 'STUDENT') {
                if (!profileInfo?.department || !profileInfo?.programme) {
                    throw new Error('Missing student profile details');
                }
                await tx.studentProfile.create({
                    data: {
                        userId: user.id,
                        department: profileInfo.department,
                        programme: profileInfo.programme,
                        phoneNumber: formattedPhone, // Saved uniformly
                    },
                });
            } else if (role === 'LECTURER') {
                if (!profileInfo?.department || !profileInfo?.specialization || !profileInfo?.officeLocation) {
                    throw new Error('Missing lecturer profile details');
                }
                await tx.lecturerProfile.create({
                    data: {
                        userId: user.id,
                        department: profileInfo.department,
                        specialization: profileInfo.specialization,
                        officeLocation: profileInfo.officeLocation,
                        phoneNumber: formattedPhone, // Saved uniformly
                    },
                });
            } else if (role === 'ADMIN') {
                await tx.adminProfile.create({
                    data: { userId: user.id },
                });
            } else {
                throw new Error('Invalid user role specified');
            }

            return user;
        });

        // 6. Fetch fully populated user to return
        const createdUser = await prisma.user.findUnique({
            where: { id: finalUser.id },
            include: {
                student: true,
                lecturer: true,
                admin: true
            }
        });

        return res.status(201).json({
            message: 'User and profile created successfully',
            user: createdUser
        });

    } catch (error) {
        // Catch block to handle validation throws and prevent server crashes
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
}


//login
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Find user in the database
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3. Verify the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // 3a. If the client supplied an expected role, ensure it matches the stored user role
        if (role) {
            const normalizedRole = role.toUpperCase();
            if (normalizedRole !== user.role) {
                return res.status(401).json({ error: "Selected role does not match this account. Please login using the correct role." });
            }
        }

        // 4. Generate the JWT token and attach it via cookie using your utility function
       const token = generateToken(user.id, user.role, res);

        // 5. Query the profile conditionally based on their exact role layout
        let profileData = null;
        if (user.role === 'STUDENT') {
            profileData = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
        } else if (user.role === 'LECTURER') {
            profileData = await prisma.lecturerProfile.findUnique({ where: { userId: user.id } });
        } else if (user.role === 'ADMIN') {
            profileData = await prisma.adminProfile.findUnique({ where: { userId: user.id } });
        }

        // 6. Prevent the password string from leaking into your API response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: userWithoutPassword,
            profile: profileData
        });

    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};


//logout
const logout = async (req, res) => {
    try {
        // Must match the exact name "token" used in generateToken
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: "If an account exists for this email, password reset instructions will be sent." });
    }

    return res.status(200).json({ message: "If an account exists for this email, password reset instructions will be sent." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export { register ,login, logout, forgotPassword };
