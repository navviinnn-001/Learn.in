import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const defaultLesson = () => ({ title: "", content: "", duration: 0 });

const CourseForm = ({ initialData, initialLessons, courseId, isEdit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(
    initialData || { title: "", description: "", category: "", difficulty: "Beginner", thumbnail: "" }
  );
  const [lessons, setLessons] = useState(initialLessons || [defaultLesson()]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onLessonChange = (i, field, val) => {
    const updated = [...lessons];
    updated[i] = { ...updated[i], [field]: val };
    setLessons(updated);
  };

  const addLesson    = () => setLessons([...lessons, defaultLesson()]);
  const removeLesson = i  => lessons.length > 1 && setLessons(lessons.filter((_, idx) => idx !== i));

  const onSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/courses/${courseId}`, { ...form, lessons });
      } else {
        await api.post("/courses", { ...form, lessons });
      }
      navigate("/instructor");
    } catch (err) {
      setError(err.response?.data?.message || (isEdit ? "Update failed" : "Failed to create course"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <span className="page-eyebrow">Instructor Studio</span>
              <h1 className="page-title">{isEdit ? "Edit Course" : "Create New Course"}</h1>
              <p className="page-desc">
                {isEdit ? "Update your course content and structure" : "Build a structured learning experience for your students"}
              </p>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error anim-fade-in">⚠ {error}</div>}

        <form onSubmit={onSubmit} style={{ maxWidth: "820px" }}>
          {/* Course Info card */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)", marginBottom: "22px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
              Course Information
            </div>

            <div className="form-group">
              <label className="form-label">Course title *</label>
              <input className="form-input" type="text" name="title"
                placeholder="e.g. Introduction to Web Development"
                value={form.title} onChange={onFormChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-textarea" name="description"
                placeholder="What will students learn? What are the prerequisites?"
                value={form.description} onChange={onFormChange} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <input className="form-input" type="text" name="category"
                  placeholder="e.g. Web Development, Data Science"
                  value={form.category} onChange={onFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Difficulty level</label>
                <select className="form-select" name="difficulty" value={form.difficulty} onChange={onFormChange}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                Thumbnail URL <span style={{ color: "var(--text-3)", fontWeight: 400, textTransform: "none", fontSize: "12px" }}>(optional)</span>
              </label>
              <input className="form-input" type="url" name="thumbnail"
                placeholder="https://example.com/image.jpg"
                value={form.thumbnail} onChange={onFormChange} />
              <p className="form-hint">Add a cover image URL to make your course stand out</p>
            </div>
          </div>

          {/* Lessons card */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", paddingBottom: "16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)" }}>
                Lessons <span style={{ fontWeight: 400, color: "var(--text-3)", fontSize: "14px" }}>({lessons.length})</span>
              </div>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addLesson}>+ Add Lesson</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {lessons.map((lesson, i) => (
                <div key={i} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderLeft: "3px solid var(--blue-dim)", borderRadius: "var(--r-sm)", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--blue)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Lesson {String(i + 1).padStart(2, "0")}
                    </span>
                    {lessons.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLesson(i)}>Remove</button>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input className="form-input" type="text" placeholder="e.g. Getting Started with HTML"
                      value={lesson.title} onChange={e => onLessonChange(i, "title", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content *</label>
                    <textarea className="form-textarea" placeholder="Lesson content, description, or key takeaways..."
                      value={lesson.content} onChange={e => onLessonChange(i, "content", e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Duration (minutes)</label>
                    <input className="form-input" type="number" min="0" placeholder="e.g. 30"
                      style={{ maxWidth: "160px" }}
                      value={lesson.duration} onChange={e => onLessonChange(i, "duration", Number(e.target.value))} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: "12px", paddingBottom: "40px" }}>
            <button type="submit" className="btn btn-primary" style={{ padding: "12px 32px" }} disabled={loading}>
              {loading ? (isEdit ? "Saving..." : "Publishing...") : (isEdit ? "Save Changes →" : "Publish Course →")}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/instructor")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;