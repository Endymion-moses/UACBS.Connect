import express from "express";
import { register, login, logout, forgotPassword } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js"; // 👈 Import the guard

const router = express.Router();

// Public Routes (Anyone can access these without a cookie)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

// Protected Route (Only logged-in users with a valid cookie can pass)
// Notice how `verifyToken` is placed right in the MIDDLE of the route definition!
router.put("/profile/update", verifyToken, async (req, res) => {

    // Because they passed the verifyToken guard, the guard leaves a gift: "req.user"
    // req.user contains the decrypted { id, role } that we packed during login!
    const userIdFromToken = req.user.id;
    const userRoleFromToken = req.user.role;

    return res.status(200).json({
        message: "You are authorized!",
        yourUserId: userIdFromToken,
        yourRole: userRoleFromToken
    });
});

export default router;
