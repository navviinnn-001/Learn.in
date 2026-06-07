// ============================================================
// pages/CourseDetail.jsx — Single Course View
// ============================================================
// Shows full course info: description, lessons, instructor.
// If user is a logged-in student:
//   - Not enrolled → show "Enroll" button
//   - Enrolled → show lesson list with checkboxes to mark progress
// useParams() gets the course :id from the URL.
// ============================================================

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams(); // get :id from URL
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null); // null if not enrolled
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Always fetch course details
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data.course);

        // If logged in as student, check enrollment
        if (user?.role === "student") {
          const enrollRes = await api.get("/enroll/my-courses");
          const found = enrollRes.data.enrollments.find(
            (e) => e.course?._id === id
          );
          setEnrollment(found || null);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  // Enroll button handler
  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/enroll/${id}`);
      // Refresh enrollment data
      const enrollRes = await api.get("/enroll/my-courses");
      const found = enrollRes.data.enrollments.find((e) => e.course?._id === id);
      setEnrollment(found);
      setMessage("🎉 Successfully enrolled!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  // Mark lesson as complete
  const handleMarkLesson = async (lessonId) => {
    try {
      const res = await api.put(`/enroll/${id}/lesson/${lessonId}`);
      // Update enrollment state with new progress
      setEnrollment((prev) => ({
        ...prev,
        completedLessons: res.data.completedLessons,
        progress: res.data.progress,
      }));
    } catch (err) {
      console.error("Error marking lesson:", err);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!course) return <div className="container"><p>Course not found</p></div>;

  const isEnrolled = !!enrollment;

  return (
    <div className="page">
      <div className="container">
        {/* Course Header */}
        <div className="course-detail-header">
          <div>
            <div className="flex gap-2 mb-4">
              <span className="badge badge-blue">{course.category}</span>
              <span className={`badge ${
                course.difficulty === "Beginner" ? "badge-green" :
                course.difficulty === "Intermediate" ? "badge-orange" : "badge-blue"
              }`}>{course.difficulty}</span>
            </div>
            <h1>{course.title}</h1>
            <p className="course-detail-desc">{course.description}</p>
            <p className="course-instructor">👨‍🏫 By {course.instructor?.name}</p>
          </div>

          {/* Enrollment Card */}
          <div className="enroll-card card">
            {enrollment ? (
              <>
                <div className="enroll-progress-label">
                  <span>Your Progress</span>
                  <strong>{enrollment.progress}%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${enrollment.progress}%` }} />
                </div>
                <p className="enroll-status">✅ Enrolled</p>
              </>
            ) : (
              <>
                {message && <div className="alert alert-error">{message}</div>}
                {user?.role === "student" ? (
                  <button
                    onClick={handleEnroll}
                    className="btn btn-primary"
                    disabled={enrolling}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now — Free"}
                  </button>
                ) : !user ? (
                  <Link to="/login" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                    Login to Enroll
                  </Link>
                ) : (
                  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    Instructors cannot enroll in courses.
                  </p>
                )}
              </>
            )}
            <div className="enroll-meta">
              <span>📚 {course.lessons.length} lessons</span>
            </div>
          </div>
        </div>

        {message && isEnrolled && (
          <div className="alert alert-success">{message}</div>
        )}

        {/* Lessons List */}
        <div className="lessons-section">
          <h2>Course Content</h2>
          {course.lessons.length === 0 ? (
            <div className="empty-state">
              <p>No lessons added yet.</p>
            </div>
          ) : (
            <div className="lessons-list">
              {course.lessons.map((lesson, index) => {
                const isDone = enrollment?.completedLessons?.includes(lesson._id);
                return (
                  <div key={lesson._id} className={`lesson-item ${isDone ? "done" : ""}`}>
                    <div className="lesson-number">{index + 1}</div>
                    <div className="lesson-info">
                      <h4>{lesson.title}</h4>
                      {isEnrolled && (
                        <p className="lesson-content">{lesson.content}</p>
                      )}
                      {lesson.duration > 0 && (
                        <span className="lesson-duration">⏱ {lesson.duration} min</span>
                      )}
                    </div>
                    {isEnrolled && (
                      <button
                        onClick={() => handleMarkLesson(lesson._id)}
                        className={`btn btn-sm ${isDone ? "btn-outline" : "btn-primary"}`}
                        disabled={isDone}
                      >
                        {isDone ? "✓ Done" : "Mark Done"}
                      </button>
                    )}
                    {!isEnrolled && (
                      <span className="lesson-locked">🔒</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
