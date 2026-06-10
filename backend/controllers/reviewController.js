const Review = require("../models/Review");
const Enrollment = require("../models/Enrollment");

const getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate("student", "name")
      .sort({ createdAt: -1 });
    const avg = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({ reviews, avgRating: parseFloat(avg), totalReviews: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const enrolled = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId });
    if (!enrolled) return res.status(403).json({ message: "You must be enrolled to review this course" });
    const existing = await Review.findOne({ student: req.user._id, course: req.params.courseId });
    if (existing) return res.status(400).json({ message: "You have already reviewed this course" });
    const review = await Review.create({ course: req.params.courseId, student: req.user._id, rating, comment });
    await review.populate("student", "name");
    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCourseReviews, addReview };