// ============================================================
// pages/EditCourse.jsx — Edit Existing Course Form
// ============================================================
// Same structure as CreateCourse, but:
//   1. On mount, fetches existing course data and pre-fills the form
//   2. On submit, sends a PUT request instead of POST
// useParams() gets the course :id from the URL.
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "./CourseForm.css";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    thumbnail: "",
  });
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing course data when page opens
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        const c = res.data.course;
        setFormData({
          title: c.title,
          description: c.description,
          category: c.category,
          difficulty: c.difficulty,
          thumbnail: c.thumbnail || "",
        });
        setLessons(c.lessons || []);
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setFetching(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: "", content: "", duration: 0 }]);
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/courses/${id}`, { ...formData, lessons });
      navigate("/instructor");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Edit Course</h1>
          <p>Update your course details</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-section card">
            <h2>Basic Information</h2>
            <div className="divider" />

            <div className="form-group">
              <label>Course Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required />
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
              <label>Thumbnail URL</label>
              <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
            </div>
          </div>

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
                  <button type="button" onClick={() => removeLesson(index)} className="btn btn-danger btn-sm">
                    Remove
                  </button>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={lesson.title}
                    onChange={(e) => handleLessonChange(index, "title", e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Content</label>
                  <textarea value={lesson.content}
                    onChange={(e) => handleLessonChange(index, "content", e.target.value)} required />
                </div>

                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input type="number" min="0" value={lesson.duration}
                    onChange={(e) => handleLessonChange(index, "duration", Number(e.target.value))} />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes →"}
            </button>
            <button type="button" onClick={() => navigate("/instructor")} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
