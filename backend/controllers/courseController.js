// ============================================================
// controllers/courseController.js — Course CRUD Logic
// ============================================================
// Handles all course-related operations:
//   - getAllCourses: Anyone can view all courses
//   - getCourse: Get a single course by ID
//   - getInstructorCourses: Instructor sees only their own courses
//   - createCourse: Only instructors can create
//   - updateCourse: Only the instructor who created it can edit
//   - deleteCourse: Only the instructor who created it can delete
// ============================================================

const Course = require("../models/Course");

// ---------- @route   GET /api/courses ----------
// Public — anyone (logged in or not) can view all courses
const getAllCourses = async (req, res) => {
  try {
    // .populate("instructor", "name email") replaces the instructor ObjectId
    // with actual name and email from the User collection
    const courses = await Course.find().populate("instructor", "name email");
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   GET /api/courses/:id ----------
// Get a single course with full details including all lessons
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   GET /api/courses/instructor/my-courses ----------
// Protected + Instructor only — get courses created by logged-in instructor
const getInstructorCourses = async (req, res) => {
  try {
    // req.user._id is the logged-in instructor's ID (set by protect middleware)
    const courses = await Course.find({ instructor: req.user._id });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   POST /api/courses ----------
// Protected + Instructor only — create a new course
const createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, thumbnail, lessons } =
      req.body;

    const course = await Course.create({
      title,
      description,
      category,
      difficulty,
      thumbnail,
      lessons: lessons || [], // if no lessons provided, start with empty array
      instructor: req.user._id, // set instructor to logged-in user
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   PUT /api/courses/:id ----------
// Protected + Instructor only — update a course (must be the owner)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Security check: make sure the logged-in instructor owns this course
    // .toString() because one is ObjectId and the other is a string
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this course" });
    }

    // Update the course with new data from request body
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // "new: true" returns the updated doc
    );

    res.json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   DELETE /api/courses/:id ----------
// Protected + Instructor only — delete a course (must be the owner)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only the instructor who created the course can delete it
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
