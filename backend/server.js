import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// 1. Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 2. Middleware configuration
app.use(cors());
app.use(express.json());

// 3. Register routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Root health check route
app.get("/", (req, res) => {
  res.json({ message: "QuickFeed API is running..." });
});

// 4. Connect to MongoDB and start Express server
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
