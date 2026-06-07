// ============================================================
// controllers/enrollController.js — Enrollment & Progress Logic
// ============================================================
// Handles student enrollment and lesson progress tracking:
//   - enrollCourse: Student enrolls in a course
//   - getMyEnrollments: Student sees their enrolled courses
//   - markLessonComplete: Student marks a lesson as done
//   - getDashboardStats: Returns stats for the dashboard
// ============================================================

const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ---------- @route   POST /api/enroll/:courseId ----------
// Student enrolls in a course
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user._id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled (the unique index will also catch this)
    const alreadyEnrolled = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create enrollment record
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      completedLessons: [],
      progress: 0,
    });

    res.status(201).json({ message: "Enrolled successfully!", enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   GET /api/enroll/my-courses ----------
// Student gets all their enrolled courses with course details
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name" }, // nested populate
      });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   PUT /api/enroll/:courseId/lesson/:lessonId ----------
// Student marks a specific lesson as complete; progress is recalculated
const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Add lessonId only if not already in the completedLessons array
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Recalculate progress percentage
    // We need the course to know total number of lessons
    const course = await Course.findById(courseId);
    const totalLessons = course.lessons.length;

    if (totalLessons > 0) {
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );
    }

    await enrollment.save();

    res.json({
      message: "Lesson marked as complete",
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   GET /api/enroll/dashboard ----------
// Returns stats for the student dashboard
const getDashboardStats = async (req, res) => {
  try {
    // Total courses available on the platform
    const totalCourses = await Course.countDocuments();

    // All enrollments for this student
    const enrollments = await Enrollment.find({ student: req.user._id });

    const enrolledCount = enrollments.length;

    // Average progress across all enrolled courses
    const avgProgress =
      enrolledCount > 0
        ? Math.round(
            enrollments.reduce((sum, e) => sum + e.progress, 0) / enrolledCount
          )
        : 0;

    res.json({
      totalCourses,
      enrolledCourses: enrolledCount,
      averageProgress: avgProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrollments,
  markLessonComplete,
  getDashboardStats,
};
