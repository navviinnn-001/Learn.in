// ============================================================
// models/Enrollment.js — Enrollment Database Schema
// ============================================================
// When a student enrolls in a course, an Enrollment document is created.
// It links a student (User) to a course (Course) and tracks progress.
// "completedLessons" is an array of lesson IDs the student has finished.
// ============================================================

const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    // Which student enrolled
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Which course they enrolled in
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Array of lesson IDs that the student has marked as complete
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId, // stores the lesson's _id
      },
    ],
    // Overall progress from 0 to 100 (percentage)
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a student can only enroll in a course ONCE
// This is a compound unique index on the combination of student + course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
