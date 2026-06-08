import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "./CourseForm.css";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", category: "", difficulty: "Beginner", thumbnail: "" });
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/courses/${id}`).then(res => {
      const c = res.data.course;
      setFormData({ title: c.title, description: c.description, category: c.category, difficulty: c.difficulty, thumbnail: c.thumbnail || "" });
      setLessons(c.lessons || []);
    }).catch(() => setError("Failed to load course")).finally(() => setFetching(false));
  }, [id]);

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
          <span className="eyebrow">Instructor Studio</span>
          <h1 className="page-title">Edit Course</h1>
          <p className="page-subtitle">Update your course content and structure</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="card">
            <div className="form-section-title">Course Information</div>
            <div className="form-group">
              <label className="form-label">Course Title *</label>
              <input className="form-input" type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <input className="form-input" type="text" name="category" value={formData.category} onChange={handleChange} required />
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
              <label className="form-label">Thumbnail URL</label>
              <input className="form-input" type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
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
                  <button type="button" onClick={() => removeLesson(index)} className="btn btn-danger btn-sm">Remove</button>
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" type="text" value={lesson.title}
                    onChange={e => handleLessonChange(index, "title", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-textarea" value={lesson.content}
                    onChange={e => handleLessonChange(index, "content", e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input className="form-input" type="number" min="0" value={lesson.duration}
                    onChange={e => handleLessonChange(index, "duration", Number(e.target.value))} />
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes →"}
            </button>
            <button type="button" onClick={() => navigate("/instructor")} className="btn btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;