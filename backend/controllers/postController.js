import mongoose from "mongoose";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";

// Helper function to upload an image buffer directly to Cloudinary
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mini-social-app/posts",
        resource_type: "image",
        format: "webp", // Save in lightweight webp format
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Create a new post (supports text, image, or both)
export const createPost = async (req, res) => {
  try {
    const text = req.body.text ? req.body.text.trim() : null;
    let imageUrl = null;

    // Step 1: If user attached an image, optimize it with Sharp and upload to Cloudinary
    if (req.file && req.file.buffer) {
      try {
        // Resize image if it's too large and convert to WebP to save bandwidth
        const optimizedBuffer = await sharp(req.file.buffer)
          .resize({
            width: 1600,
            height: 1600,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toBuffer();

        // Upload in-memory buffer directly to Cloudinary
        const uploadResult = await uploadBufferToCloudinary(optimizedBuffer);
        imageUrl = uploadResult.secure_url;
      } catch (sharpError) {
        console.error("Image processing error:", sharpError);
        return res.status(400).json({
          message: "Failed to process image. Please upload a valid image file.",
        });
      }
    }

    // Step 2: Validate that user wrote text OR uploaded an image
    if (!text && !imageUrl) {
      return res.status(400).json({
        message: "Write something or add an image before posting.",
      });
    }

    // Step 3: Save post to MongoDB
    const newPost = await Post.create({
      user: req.user.userId,
      text: text || null,
      image: imageUrl || null,
      likedBy: [],
      comments: [],
    });

    // Step 4: Populate author username
    await newPost.populate("user", "username");

    // Step 5: Format response for frontend state
    const formattedPost = {
      _id: newPost._id,
      text: newPost.text,
      image: newPost.image,
      user: {
        _id: newPost.user._id,
        username: newPost.user.username,
      },
      liked: false,
      likeCount: 0,
      commentCount: 0,
      comments: [],
      createdAt: newPost.createdAt,
      updatedAt: newPost.updatedAt,
    };

    return res.status(201).json({
      message: "Post created successfully",
      post: formattedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      message: "Server error while creating post. Please try again.",
    });
  }
};

// Get all public posts (newest first)
export const getPosts = async (req, res) => {
  try {
    const currentUserId = req.user?.userId ? req.user.userId.toString() : null;

    // Fetch all posts, populate author and commenter usernames, sorted by newest
    const posts = await Post.find()
      .populate("user", "username")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 });

    // Format posts with liked status and counts
    const formattedPosts = posts.map((post) => {
      // Check if logged-in user has liked this post
      const isLiked = currentUserId
        ? post.likedBy.some((id) => id.toString() === currentUserId)
        : false;

      return {
        _id: post._id,
        text: post.text,
        image: post.image,
        user: post.user
          ? {
              _id: post.user._id,
              username: post.user.username,
            }
          : { username: "Unknown" },
        liked: isLiked,
        likeCount: post.likedBy.length,
        commentCount: post.comments.length,
        comments: post.comments.map((c) => ({
          _id: c._id,
          text: c.text,
          user: c.user
            ? {
                _id: c.user._id,
                username: c.user.username,
              }
            : { username: "Unknown" },
          createdAt: c.createdAt,
        })),
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });

    return res.status(200).json({
      posts: formattedPosts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({
      message: "Server error retrieving posts. Please try again.",
    });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const userId = req.user.userId;

    // Use $addToSet to add userId to likedBy without creating duplicates
    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likedBy: userId } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      liked: true,
      likeCount: post.likedBy.length,
    });
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({
      message: "Server error while liking post.",
    });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const userId = req.user.userId;

    // Use $pull to remove userId from likedBy array
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likedBy: userId } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      liked: false,
      likeCount: post.likedBy.length,
    });
  } catch (error) {
    console.error("Unlike post error:", error);
    return res.status(500).json({
      message: "Server error while unliking post.",
    });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const { text } = req.body;
    const trimmedText = text ? text.trim() : "";

    // Validate comment is not empty
    if (!trimmedText) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (trimmedText.length > 500) {
      return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Append new comment to embedded comments array
    post.comments.push({
      user: req.user.userId,
      text: trimmedText,
      createdAt: new Date(),
    });

    await post.save();

    // Populate commenter username before returning
    await post.populate("comments.user", "username");

    const createdComment = post.comments[post.comments.length - 1];

    return res.status(201).json({
      comment: {
        _id: createdComment._id,
        text: createdComment.text,
        user: {
          _id: createdComment.user._id,
          username: createdComment.user.username,
        },
        createdAt: createdComment.createdAt,
      },
      commentCount: post.comments.length,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({
      message: "Server error while adding comment.",
    });
  }
};

// Delete a comment (users can only delete their own comments)
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid post or comment ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment in the post's embedded comments array
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Security check: Make sure user owns this comment
    if (comment.user.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        message: "You are only allowed to delete your own comments.",
      });
    }

    // Pull comment and save post
    post.comments.pull({ _id: commentId });
    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      commentCount: post.comments.length,
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({
      message: "Server error while deleting comment.",
    });
  }
};
