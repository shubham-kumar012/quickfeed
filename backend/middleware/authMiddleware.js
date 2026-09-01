import jwt from "jsonwebtoken";

// Middleware to verify JWT token and protect private routes
const authMiddleware = (req, res, next) => {
  try {
    // 1. Get Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // 2. Extract token from header
    const token = authHeader.split(" ")[1];

    // 3. Verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded payload (contains userId) to request object
    req.user = decoded;

    // 5. Proceed to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default authMiddleware;
