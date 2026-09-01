import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { handleImageUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public route: Get all posts
router.get("/", getPosts);

// Protected route: Create post (with memory-buffered image upload)
router.post("/", authMiddleware, handleImageUpload, createPost);

export default router;
