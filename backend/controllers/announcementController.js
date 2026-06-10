const Announcement = require("../models/Announcement");
const Course = require("../models/Course");

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ course: req.params.courseId })
      .populate("instructor", "name")
      .sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    const { title, body } = req.body;
    const announcement = await Announcement.create({
      course: req.params.courseId,
      instructor: req.user._id,
      title,
      body,
    });
    await announcement.populate("instructor", "name");
    res.status(201).json({ message: "Announcement posted", announcement });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (!ann) return res.status(404).json({ message: "Not found" });
    if (ann.instructor.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnnouncements, createAnnouncement, deleteAnnouncement };