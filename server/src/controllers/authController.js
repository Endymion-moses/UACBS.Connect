import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { generateToken } from "../utils/generateToken.js";

const getPasswordResetSecret = () => process.env.JWT_RESET_PASSWORD_SECRET || process.env.JWT_SECRET || "fallback_secret_key_123";


//forgot password 
const createPasswordResetToken = (userId) => {
  return jwt.sign({ id: userId, type: "RESET_PASSWORD" }, getPasswordResetSecret(), {
    expiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN || "1h",
  });
};

const createPasswordTransporter = async () => {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 0);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const secure = process.env.EMAIL_SECURE === "true";

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  console.warn("Email provider is not configured. Using Nodemailer test SMTP account for password reset debugging.");
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const transporter = await createPasswordTransporter();

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@uacbs.local";
  const subject = "Reset your UACBS password";
  const text = `Hello ${user.fullName},\n\n` +
    `A password reset was requested for your account. If you did not request this, you can ignore this email.\n\n` +
    `Reset your password here: ${resetUrl}\n\n` +
    `This link expires in ${process.env.JWT_PASSWORD_RESET_EXPIRES_IN || "1 hour"}.\n\n` +
    `Thanks,\nUACBS Team`;
  const html = `<p>Hello ${user.fullName},</p>` +
    `<p>A password reset was requested for your account. If you did not request this, you can ignore this email.</p>` +
    `<p><a href="${resetUrl}" target="_blank" rel="noopener">Reset your password</a></p>` +
    `<p>This link expires in ${process.env.JWT_PASSWORD_RESET_EXPIRES_IN || "1 hour"}.</p>` +
    `<p>Thanks,<br/>UACBS Team</p>`;

  const info = await transporter.sendMail({
    from,
    to: user.email,
    subject,
    text,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.warn("Password reset email preview URL:", previewUrl);
  }

  return { info, previewUrl };
};

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

    const resetToken = createPasswordResetToken(user.id);
    const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    let emailResult;
    try {
      emailResult = await sendPasswordResetEmail(user, resetUrl);
    } catch (emailError) {
      console.error("Password reset email failed:", emailError);
      return res.status(500).json({ message: "Unable to send password reset email. Check server email configuration." });
    }

    const successResponse = {
      message: "If an account exists for this email, password reset instructions will be sent.",
    };
    if (emailResult?.previewUrl) {
      successResponse.previewUrl = emailResult.previewUrl;
      successResponse.debug = "A preview URL has been generated for the password reset email.";
    }

    return res.status(200).json(successResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const verifyPasswordResetToken = (token) => {
  return jwt.verify(token, getPasswordResetSecret());
};

const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required." });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Password and confirmation are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    let decoded;
    try {
      decoded = verifyPasswordResetToken(token);
    } catch (error) {
      return res.status(400).json({ message: "Reset token is invalid or has expired." });
    }

    if (!decoded?.id || decoded.type !== "RESET_PASSWORD") {
      return res.status(400).json({ message: "Reset token is invalid." });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({ message: "Password reset successfully. You can now sign in with your new password." });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export { register ,login, logout, forgotPassword, resetPassword };
