import mongoose from "mongoose";

// Post schema definition for our MongoDB 'posts' collection
const postSchema = new mongoose.Schema(
  {
    // The author who created this post (references User model)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author (user) is required"],
    },
    // Optional post text content
    text: {
      type: String,
      trim: true,
      default: null,
    },
    // Optional post image URL (stored on Cloudinary)
    image: {
      type: String,
      default: null,
    },
    // List of user IDs who liked this post (avoids needing a separate collection)
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Embedded comments list inside the post
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: [true, "Comment text is required"],
          trim: true,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Custom check to make sure the user writes text OR selects an image before saving
postSchema.pre("validate", function (next) {
  const hasText = Boolean(this.text && this.text.trim().length > 0);
  const hasImage = Boolean(this.image && this.image.trim().length > 0);

  if (!hasText && !hasImage) {
    this.invalidate("content", "A post must contain either text or an image.");
  }
  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
