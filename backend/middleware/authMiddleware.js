import jwt from "jsonwebtoken";

// Middleware to check if user is logged in (has a valid JWT token)
export const authMiddleware = (req, res, next) => {
  try {
    // 1. Get the Authorization header (e.g., "Bearer eyJhbGciOi...")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Please log in first.",
      });
    }

    // 2. Extract the actual token string after "Bearer "
    const token = authHeader.split(" ")[1];

    // 3. Verify token with our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach decoded user data (contains userId) to req.user
    req.user = decoded;

    // 5. Everything looks good, proceed to next step
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session has expired. Please log in again.",
    });
  }
};

// Optional auth helper: reads user if logged in, but doesn't reject visitors
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // If token is invalid or missing, user is just treated as guest
    req.user = null;
  }
  next();
};

export default authMiddleware;
