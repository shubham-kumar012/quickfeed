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

// Get public posts feed (uses optional auth so we know if logged-in user liked each post)
router.get("/", optionalAuthMiddleware, getPosts);

// Create a new post (must be logged in + processes image if uploaded)
router.post("/", authMiddleware, handleImageUpload, createPost);

// Like or Unlike a post
router.post("/:postId/like", authMiddleware, likePost);
router.delete("/:postId/like", authMiddleware, unlikePost);

// Add a comment or Delete your own comment
router.post("/:postId/comments", authMiddleware, addComment);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
