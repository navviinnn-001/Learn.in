import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";

const InstructorPanel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/courses/instructor/my-courses")
      .then(r => setCourses(r.data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      setMsg("Course deleted successfully.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <span className="page-eyebrow">Instructor Studio</span>
              <h1 className="page-title">My Courses</h1>
              <p className="page-desc">{courses.length} course{courses.length !== 1 ? "s" : ""} published</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/instructor/students" className="btn btn-secondary">View Students</Link>
              <Link to="/create-course" className="btn btn-primary">+ New Course</Link>
            </div>
          </div>
        </div>

        {msg && (
          <div className={`alert ${msg.includes("deleted") ? "alert-success" : "alert-error"} anim-fade-in`}>
            {msg}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📖</div>
            <div className="empty-title">No courses yet</div>
            <div className="empty-desc">Create your first course to start teaching</div>
            <Link to="/create-course" className="btn btn-primary">Create Course</Link>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map((c, i) => (
              <div key={c._id} className="anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <CourseCard course={c} showActions onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorPanel;