// ============================================================
// middleware/authMiddleware.js — JWT Authentication Middleware
// ============================================================
// Middleware = a function that runs BETWEEN the request and the controller.
// This file has two middleware functions:
//   1. protect()    → checks if user is logged in (has a valid JWT token)
//   2. authorize()  → checks if user has the required role (e.g. "instructor")
//
// How JWT works:
//   - When user logs in, we create a token and send it to the frontend.
//   - Frontend stores the token and sends it in the "Authorization" header.
//   - This middleware reads that header, verifies the token, and attaches
//     the user to req.user so the controller knows who is making the request.
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ---------- protect middleware ----------
// Checks if the request has a valid JWT token
const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the header like: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Split "Bearer eyJhbGci..." → take only the token part
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // jwt.verify() decodes and verifies the token using our secret
    // It throws an error if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the full user object to req.user (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Move on to the actual controller
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// ---------- authorize middleware ----------
// Checks if the logged-in user has one of the allowed roles
// Usage: authorize("instructor") or authorize("student", "instructor")
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${roles.join("/")} can do this.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
