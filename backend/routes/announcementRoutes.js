const express = require("express");
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/:courseId", protect, getAnnouncements);
router.post("/:courseId", protect, authorize("instructor"), createAnnouncement);
router.delete("/:id", protect, authorize("instructor"), deleteAnnouncement);

module.exports = router;