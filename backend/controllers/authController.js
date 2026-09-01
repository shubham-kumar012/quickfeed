import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to create a JWT token with the user's ID
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token valid for 7 days
  });
};

// Register a new user
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Step 1: Make sure all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email, and password",
      });
    }

    const trimmedUsername = username.trim();

    // Step 2: Validate username length (between 3 and 30 characters)
    if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
      return res.status(400).json({
        message: "Username must be between 3 and 30 characters long",
      });
    }

    // Step 3: Check that username does not contain spaces
    if (/\s/.test(username)) {
      return res.status(400).json({
        message: "Username cannot contain spaces",
      });
    }

    // Step 4: Allow only alphanumeric characters and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores",
      });
    }

    // Step 5: Password must be at least 6 characters long
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Step 6: Check if email is already registered in our database
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered. Please log in instead.",
      });
    }

    // Step 7: Hash the password using bcrypt for security
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step 8: Save the new user in MongoDB
    const newUser = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Step 9: Generate JWT token for the user
    const token = generateToken(newUser._id);

    // Step 10: Send back the token and user details (without password)
    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Server error during registration. Please try again later.",
    });
  }
};

// Log in an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check if email and password were sent
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    // Step 2: Find user by normalized email
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Return generic message so attackers cannot guess registered emails
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Step 3: Compare entered password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Step 4: Password matches! Generate JWT token
    const token = generateToken(user._id);

    // Step 5: Return user profile and token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login. Please try again later.",
    });
  }
};

// Get profile of currently logged-in user
export const getMe = async (req, res) => {
  try {
    // req.user is attached by authMiddleware after verifying token
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({
      message: "Server error retrieving user data.",
    });
  }
};
