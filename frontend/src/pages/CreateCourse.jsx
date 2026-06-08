import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "./CourseForm.css";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", category: "", difficulty: "Beginner", thumbnail: "" });
  const [lessons, setLessons] = useState([{ title: "", content: "", duration: 0 }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };
  const addLesson = () => setLessons([...lessons, { title: "", content: "", duration: 0 }]);
  const removeLesson = (index) => setLessons(lessons.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/courses", { ...formData, lessons });
      navigate("/instructor");
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
          <span className="eyebrow">Instructor Studio</span>
          <h1 className="page-title">Create New Course</h1>
          <p className="page-subtitle">Build a structured learning experience for your students</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="card">
            <div className="form-section-title">Course Information</div>

            <div className="form-group">
              <label className="form-label">Course Title *</label>
              <input className="form-input" type="text" name="title"
                placeholder="e.g. Introduction to Web Development"
                value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description"
                placeholder="What will students learn in this course?"
                value={formData.description} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <input className="form-input" type="text" name="category"
                  placeholder="e.g. Web Development"
                  value={formData.category} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select className="form-select" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Thumbnail URL (optional)</label>
              <input className="form-input" type="url" name="thumbnail"
                placeholder="https://example.com/image.jpg"
                value={formData.thumbnail} onChange={handleChange} />
            </div>
          </div>

          <div className="card">
            <div className="form-section-title">
              <span>Lessons ({lessons.length})</span>
              <button type="button" onClick={addLesson} className="btn btn-outline btn-sm">+ Add Lesson</button>
            </div>

            {lessons.map((lesson, index) => (
              <div key={index} className="lesson-item">
                <div className="lesson-item-header">
                  <span className="lesson-item-num">Lesson {String(index + 1).padStart(2, "0")}</span>
                  {lessons.length > 1 && (
                    <button type="button" onClick={() => removeLesson(index)} className="btn btn-danger btn-sm">Remove</button>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" type="text" placeholder="e.g. Getting Started with HTML"
                    value={lesson.title} onChange={e => handleLessonChange(index, "title", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Content *</label>
                  <textarea className="form-textarea" placeholder="Lesson content or description..."
                    value={lesson.content} onChange={e => handleLessonChange(index, "content", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input className="form-input" type="number" min="0" placeholder="30"
                    value={lesson.duration} onChange={e => handleLessonChange(index, "duration", Number(e.target.value))} />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Publishing..." : "Publish Course →"}
            </button>
            <button type="button" onClick={() => navigate("/instructor")} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;