const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  markLessonComplete,
  getDashboardStats,
  getInstructorStudents,
} = require("../controllers/enrollController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/my-courses", protect, authorize("student"), getMyEnrollments);
router.get("/dashboard", protect, authorize("student"), getDashboardStats);
router.get("/instructor/students", protect, authorize("instructor"), getInstructorStudents);

router.post("/:courseId", protect, authorize("student"), enrollCourse);
router.put("/:courseId/lesson/:lessonId", protect, authorize("student"), markLessonComplete);

module.exports = router;