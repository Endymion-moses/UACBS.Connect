import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Read the cookie from the request (enabled by cookie-parser)
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Access denied. No session token found." });
        }

        const secret = process.env.JWT_SECRET || "fallback_secret_key_123";

        // Verify token authenticity
        const decoded = jwt.verify(token, secret);

        // Append user meta-data directly onto the request lifecycle pipeline
        req.user = decoded;

        next(); // Move to the next controller function safely
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired session token." });
    }
};
