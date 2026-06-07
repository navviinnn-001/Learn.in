// ============================================================
// pages/CreateCourse.jsx — Create New Course Form
// ============================================================
// Multi-section form:
//   1. Basic info (title, description, category, difficulty)
//   2. Dynamic lessons — instructor can add/remove lessons
//
// The "lessons" field is an array in state.
// Each lesson has: title, content, duration.
// We use index-based updates for simplicity.
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./CourseForm.css";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    thumbnail: "",
  });

  // Start with one empty lesson
  const [lessons, setLessons] = useState([
    { title: "", content: "", duration: 0 },
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle changes to top-level course fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle changes to a specific lesson by index
  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons]; // copy array
    updated[index][field] = value;
    setLessons(updated);
  };

  // Add a new empty lesson to the list
  const addLesson = () => {
    setLessons([...lessons, { title: "", content: "", duration: 0 }]);
  };

  // Remove a lesson at a specific index
  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/courses", { ...formData, lessons });
      navigate("/instructor"); // go back to instructor panel
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Create New Course</h1>
          <p>Fill in the details and add lessons</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          {/* ---- Basic Info Section ---- */}
          <div className="form-section card">
            <h2>Basic Information</h2>
            <div className="divider" />

            <div className="form-group">
              <label>Course Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Introduction to Web Development"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="What will students learn in this course?"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Web Development, Data Science"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Thumbnail URL (optional)</label>
              <input
                type="url"
                name="thumbnail"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ---- Lessons Section ---- */}
          <div className="form-section card">
            <div className="flex-between">
              <h2>Lessons ({lessons.length})</h2>
              <button type="button" onClick={addLesson} className="btn btn-outline btn-sm">
                + Add Lesson
              </button>
            </div>
            <div className="divider" />

            {lessons.map((lesson, index) => (
              <div key={index} className="lesson-form-item">
                <div className="lesson-form-header">
                  <span className="lesson-form-num">Lesson {index + 1}</span>
                  {lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Lesson Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Getting Started with HTML"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    placeholder="Lesson content or description..."
                    value={lesson.content}
                    onChange={(e) => handleLessonChange(index, "content", e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="30"
                    value={lesson.duration}
                    onChange={(e) => handleLessonChange(index, "duration", Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ---- Submit ---- */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Course →"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/instructor")}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
