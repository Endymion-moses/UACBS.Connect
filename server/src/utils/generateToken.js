import jwt from "jsonwebtoken";

export const generateToken = (userId, role, res) => {
    // 1. Include role in the payload to make middleware checks faster
    const payload = {
        id: userId,
        role: role
    };

    // Fallback secret if the .env variable is missing during setup
    const secret = process.env.JWT_SECRET || "fallback_secret_key_123";

    const token = jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d" // Default fallback string
    });

    // 2. Set the secure cookie
    res.cookie("token", token, { // Standardized name to "token"
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days in milliseconds
    });

    return token;

    
};
