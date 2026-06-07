// ============================================================
// pages/InstructorPanel.jsx — Instructor Course Management
// ============================================================
// Shows all courses created by the logged-in instructor.
// Instructor can edit or delete each course.
// Delete action calls the API and removes from list on success.
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";

const InstructorPanel = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/instructor/my-courses");
      setCourses(res.data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      // Remove from state without re-fetching
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setMessage("Course deleted successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="flex-between page-header">
          <div>
            <h1>My Courses</h1>
            <p>{courses.length} course{courses.length !== 1 ? "s" : ""} created</p>
          </div>
          <Link to="/create-course" className="btn btn-primary">
            + New Course
          </Link>
        </div>

        {message && (
          <div className={`alert ${message.includes("deleted") ? "alert-success" : "alert-error"}`}>
            {message}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses yet</h3>
            <p>Create your first course to get started</p>
            <Link to="/create-course" className="btn btn-primary mt-4">
              Create Course
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                showActions={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorPanel;
