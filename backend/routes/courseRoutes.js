// ============================================================
// routes/courseRoutes.js — Course Routes
// ============================================================
// Routes for course management:
//   GET    /api/courses                      → all courses (public)
//   GET    /api/courses/instructor/my-courses → instructor's own courses
//   GET    /api/courses/:id                  → single course (public)
//   POST   /api/courses                      → create course (instructor only)
//   PUT    /api/courses/:id                  → update course (instructor only)
//   DELETE /api/courses/:id                  → delete course (instructor only)
//
// protect → checks if logged in
// authorize("instructor") → checks if user is an instructor
// ============================================================

const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourse,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

// IMPORTANT: specific routes must come BEFORE parameterized routes like /:id
// Otherwise "my-courses" would be treated as an :id parameter
router.get("/instructor/my-courses", protect, authorize("instructor"), getInstructorCourses);

router.get("/", getAllCourses);
router.get("/:id", getCourse);

router.post("/", protect, authorize("instructor"), createCourse);
router.put("/:id", protect, authorize("instructor"), updateCourse);
router.delete("/:id", protect, authorize("instructor"), deleteCourse);

module.exports = router;
