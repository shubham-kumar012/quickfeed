import express from "express";
import {
  createPost,
  getPosts,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} from "../controllers/postController.js";
import authMiddleware, { optionalAuthMiddleware } from "../middleware/authMiddleware.js";
import { handleImageUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public route: Get all posts (optional authentication for user's liked status)
router.get("/", optionalAuthMiddleware, getPosts);

// Protected route: Create post (with memory-buffered image upload)
router.post("/", authMiddleware, handleImageUpload, createPost);

// Protected routes: Like / Unlike a post
router.post("/:postId/like", authMiddleware, likePost);
router.delete("/:postId/like", authMiddleware, unlikePost);

// Protected routes: Add & Delete comments on a post
router.post("/:postId/comments", authMiddleware, addComment);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
