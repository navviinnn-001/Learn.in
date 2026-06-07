// ============================================================
// models/Course.js — Course Database Schema
// ============================================================
// This defines what a Course looks like in MongoDB.
// A course has a title, description, instructor (reference to User),
// list of lessons, and category/difficulty info.
// ============================================================

const mongoose = require("mongoose");

// Sub-schema for individual lessons inside a course
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // duration in minutes
    default: 0,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    thumbnail: {
      type: String,
      default: "", // URL to thumbnail image (optional)
    },
    // "instructor" stores the ObjectId of the User who created this course
    // "ref: 'User'" tells Mongoose this links to the User model (for populate())
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessons: [lessonSchema], // array of lesson objects
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
