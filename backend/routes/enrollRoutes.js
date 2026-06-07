// ============================================================
// routes/enrollRoutes.js — Enrollment Routes
// ============================================================
// All enrollment routes require the user to be logged in (protect).
// Only students can enroll and track progress.
//
//   POST /api/enroll/:courseId                        → enroll in course
//   GET  /api/enroll/my-courses                       → get enrolled courses
//   PUT  /api/enroll/:courseId/lesson/:lessonId        → mark lesson done
//   GET  /api/enroll/dashboard                        → dashboard stats
// ============================================================

const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  markLessonComplete,
  getDashboardStats,
} = require("../controllers/enrollController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes here require authentication
// Specific routes before parameterized routes
router.get("/my-courses", protect, authorize("student"), getMyEnrollments);
router.get("/dashboard", protect, authorize("student"), getDashboardStats);

router.post("/:courseId", protect, authorize("student"), enrollCourse);
router.put("/:courseId/lesson/:lessonId", protect, authorize("student"), markLessonComplete);

module.exports = router;
