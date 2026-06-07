// ============================================================
// server.js — Entry Point of the Backend
// ============================================================
// This file starts the Express server.
// It connects to MongoDB and registers all route files.
// Think of this as the "main gate" of the backend.
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ---------- Middleware ----------
// cors() allows the frontend (running on port 5173) to talk to backend (port 5000)
app.use(cors());

// express.json() lets us read JSON data sent in request body
app.use(express.json());

// ---------- Routes ----------
// Each route file handles a specific part of the app
app.use("/api/auth", require("./routes/authRoutes"));       // Register / Login
app.use("/api/courses", require("./routes/courseRoutes"));  // Course CRUD
app.use("/api/enroll", require("./routes/enrollRoutes"));   // Enroll + Progress

// ---------- Default Route ----------
app.get("/", (req, res) => {
  res.json({ message: "Learn.in API is running!" });
});

// ---------- Connect to MongoDB and Start Server ----------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
