const express = require("express");
const router = express.Router();
const { getCourseReviews, addReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/:courseId", getCourseReviews);
router.post("/:courseId", protect, authorize("student"), addReview);

module.exports = router;