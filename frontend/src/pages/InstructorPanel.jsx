import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";

const InstructorPanel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/courses/instructor/my-courses")
      .then(res => setCourses(res.data.courses))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course permanently?")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      setMessage("Course deleted successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Instructor Studio</span>
          <div className="flex-between" style={{ paddingTop: "20px", alignItems: "flex-end" }}>
            <div>
              <h1 className="page-title" style={{ paddingTop: 0, marginBottom: "6px" }}>My Courses</h1>
              <p className="page-subtitle">{courses.length} course{courses.length !== 1 ? "s" : ""} published</p>
            </div>
            <Link to="/create-course" className="btn btn-primary">+ New Course</Link>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes("deleted") ? "alert-success" : "alert-error"} animate-fade-in`}>
            {message}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <h3>No courses yet</h3>
            <p>Create your first course to start teaching</p>
            <Link to="/create-course" className="btn btn-primary mt-4">Create Course</Link>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map((course, i) => (
              <div key={course._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                <CourseCard course={course} showActions={true} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorPanel;