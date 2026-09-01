import mongoose from "mongoose";

// Regex pattern to check valid email address
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Regex pattern: username can have letters, numbers, and underscores (no spaces allowed)
const usernameRegex = /^[a-zA-Z0-9_]+$/;

// User schema definition for our MongoDB 'users' collection
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        usernameRegex,
        "Username can only contain letters, numbers, and underscores (no spaces)",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Prevents duplicate email signups
      trim: true,
      lowercase: true,
      match: [emailRegex, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

export default User;
