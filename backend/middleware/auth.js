const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware: protect
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user to req.user for downstream handlers.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

/**
 * Middleware: adminOnly
 * Must be used AFTER protect middleware.
 * Restricts access to users with role === 'admin'.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = { protect, adminOnly };
