// ============================================================
// controllers/authController.js — Registration & Login Logic
// ============================================================
// A "Controller" contains the actual business logic for a route.
// The router just decides WHICH controller function to call.
// This controller handles:
//   - registerUser: Creates a new user account
//   - loginUser: Checks credentials and returns a JWT token
//   - getMe: Returns the currently logged-in user's profile
// ============================================================

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ---------- Helper: Generate JWT Token ----------
// We put this in a function so we don't repeat it everywhere
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // payload: what we store inside the token
    process.env.JWT_SECRET,      // secret key to sign the token
    { expiresIn: process.env.JWT_EXPIRE } // token expires in 7 days
  );
};

// ---------- @route   POST /api/auth/register ----------
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create the new user (password is hashed automatically via pre-save hook)
    const user = await User.create({ name, email, password, role });

    // Generate token for immediate login after registration
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   POST /api/auth/login ----------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Use the comparePassword method we defined in the User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- @route   GET /api/auth/me ----------
// Returns the profile of the currently logged-in user
// This route is protected — requires valid JWT
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
