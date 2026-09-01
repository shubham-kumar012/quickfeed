import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author (user) is required"],
    },
    text: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Custom validation to ensure at least one of text or image is present
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
