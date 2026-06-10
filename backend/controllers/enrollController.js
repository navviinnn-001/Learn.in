const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const exists = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (exists) return res.status(400).json({ message: "Already enrolled in this course" });
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      completedLessons: [],
      progress: 0,
    });
    res.status(201).json({ message: "Enrolled successfully!", enrollment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate({
      path: "course",
      populate: { path: "instructor", select: "name email" },
    });
    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    const course = await Course.findById(courseId);
    if (course.lessons.length > 0) {
      enrollment.progress = Math.round(
        (enrollment.completedLessons.length / course.lessons.length) * 100
      );
    }
    await enrollment.save();
    res.json({
      message: "Lesson marked complete",
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const enrollments = await Enrollment.find({ student: req.user._id });
    const enrolledCount = enrollments.length;
    const avgProgress = enrolledCount > 0
      ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrolledCount)
      : 0;
    const completed = enrollments.filter(e => e.progress === 100).length;
    res.json({ totalCourses, enrolledCourses: enrolledCount, averageProgress: avgProgress, completedCourses: completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW — instructor sees all students for their courses
const getInstructorStudents = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).select("_id title lessons");
    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("student", "name email createdAt")
      .populate("course", "title lessons");

    const courseMap = {};
    courses.forEach(c => {
      courseMap[c._id.toString()] = {
        _id: c._id,
        title: c.title,
        totalLessons: c.lessons.length,
        students: [],
        totalEnrolled: 0,
        avgProgress: 0,
      };
    });

    enrollments.forEach(e => {
      const key = e.course?._id?.toString();
      if (key && courseMap[key]) {
        courseMap[key].students.push({
          _id: e.student?._id,
          name: e.student?.name,
          email: e.student?.email,
          joinedAt: e.student?.createdAt,
          enrolledAt: e.createdAt,
          progress: e.progress,
          completedLessons: e.completedLessons.length,
          totalLessons: courseMap[key].totalLessons,
        });
        courseMap[key].totalEnrolled++;
      }
    });

    Object.values(courseMap).forEach(c => {
      if (c.students.length > 0) {
        c.avgProgress = Math.round(
          c.students.reduce((s, st) => s + st.progress, 0) / c.students.length
        );
      }
    });

    const result = Object.values(courseMap);
    const totalStudents = new Set(enrollments.map(e => e.student?._id?.toString())).size;

    res.json({ courses: result, totalStudents, totalEnrollments: enrollments.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { enrollCourse, getMyEnrollments, markLessonComplete, getDashboardStats, getInstructorStudents };