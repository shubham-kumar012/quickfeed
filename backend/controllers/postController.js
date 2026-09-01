import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import Post from "../models/Post.js";

// Helper function to upload an in-memory buffer to Cloudinary via upload_stream
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "mini-social-app/posts",
        resource_type: "image",
        format: "webp",
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

// @desc    Create a new post (text, image, or text + image)
// @route   POST /api/posts
// @access  Private (Authenticated users only)
export const createPost = async (req, res) => {
  try {
    const text = req.body.text ? req.body.text.trim() : null;
    let imageUrl = null;

    // 1. Process and upload image if provided in request
    if (req.file && req.file.buffer) {
      try {
        // Optimize image with Sharp: resize if > 1600px, compress and convert to WebP
        const optimizedBuffer = await sharp(req.file.buffer)
          .resize({
            width: 1600,
            height: 1600,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80 })
          .toBuffer();

        // Upload optimized WebP buffer to Cloudinary
        const uploadResult = await uploadBufferToCloudinary(optimizedBuffer);
        imageUrl = uploadResult.secure_url;
      } catch (sharpError) {
        console.error("Image processing/upload error:", sharpError);
        return res.status(400).json({
          message: "Failed to process image. Please upload a valid image file.",
        });
      }
    }

    // 2. Validate that at least text OR image is present
    if (!text && !imageUrl) {
      return res.status(400).json({
        message: "Write something or add an image before posting.",
      });
    }

    // 3. Create and save post in MongoDB
    const newPost = await Post.create({
      user: req.user.userId,
      text: text || null,
      image: imageUrl || null,
    });

    // 4. Populate author's username
    await newPost.populate("user", "username");

    // 5. Return created post
    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      message: "Server error while creating post. Please try again.",
    });
  }
};

// @desc    Get all public posts (newest first)
// @route   GET /api/posts
// @access  Public (Visible to everyone)
export const getPosts = async (req, res) => {
  try {
    // Retrieve all posts sorted newest first with populated author username
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({
      message: "Server error retrieving posts. Please try again.",
    });
  }
};
