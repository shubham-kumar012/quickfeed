import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

// Read environment variables from our .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Standard middleware setup
// cors allows our React frontend to talk to this backend
app.use(cors());
// express.json parses incoming JSON data in request bodies
app.use(express.json());

// Main API routes for authentication and posts
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Simple health-check route to see if backend is alive
app.get("/", (req, res) => {
  res.json({ message: "QuickFeed API is running..." });
});

// Function to connect to MongoDB database and then start the server
const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in your .env file!");
    }

    // Connect to database
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully");

    // Start listening for requests on port 5000
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

startServer();
