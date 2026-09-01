import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public auth routes (anyone can access)
router.post("/signup", signup);
router.post("/login", login);

// Protected auth route (requires valid JWT token in headers)
router.get("/me", authMiddleware, getMe);

export default router;
