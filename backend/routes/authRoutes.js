// ============================================================
// routes/authRoutes.js — Authentication Routes
// ============================================================
// A "Route" maps a URL path + HTTP method to a controller function.
// The router doesn't contain logic — it just connects URLs to controllers.
//
// Routes defined here:
//   POST /api/auth/register → registerUser
//   POST /api/auth/login    → loginUser
//   GET  /api/auth/me       → getMe (requires login)
// ============================================================

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes — no token needed
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route — user must be logged in
// "protect" middleware runs first, then getMe
router.get("/me", protect, getMe);

module.exports = router;
