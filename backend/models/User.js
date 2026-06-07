// ============================================================
// models/User.js — User Database Schema
// ============================================================
// A "Model" defines the shape/structure of a document in MongoDB.
// This file defines what a User looks like in the database.
// Fields: name, email, password, role (student or instructor)
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema = blueprint for a document in the collection
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have same email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "instructor"], // only these two values allowed
      default: "student",
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// ---------- Pre-save Hook ----------
// This runs automatically BEFORE saving a user to the database.
// It hashes the password so we never store plain text passwords.
userSchema.pre("save", async function (next) {
  // Only hash if the password field was changed (prevents re-hashing on update)
  if (!this.isModified("password")) return next();

  // bcrypt.genSalt(10) creates a "salt" — random data added to password before hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------- Instance Method ----------
// We add a custom method to compare entered password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model so other files can use it
module.exports = mongoose.model("User", userSchema);
