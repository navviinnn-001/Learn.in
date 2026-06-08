import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data.course);
        if (user?.role === "student") {
          const enrollRes = await api.get("/enroll/my-courses");
          const found = enrollRes.data.enrollments.find(e => e.course?._id === id);
          setEnrollment(found || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/enroll/${id}`);
      const enrollRes = await api.get("/enroll/my-courses");
      const found = enrollRes.data.enrollments.find(e => e.course?._id === id);
      setEnrollment(found);
      setMessage("🎉 Successfully enrolled!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleMarkLesson = async (lessonId) => {
    try {
      const res = await api.put(`/enroll/${id}/lesson/${lessonId}`);
      setEnrollment(prev => ({
        ...prev,
        completedLessons: res.data.completedLessons,
        progress: res.data.progress,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!course) return <div className="container"><p>Course not found</p></div>;

  const isEnrolled = !!enrollment;

  return (
    <div style={{ paddingTop: "72px" }}>
      {/* Hero */}
      <div className="course-detail-hero">
        <div className="container">
          <div className="course-detail-grid">
            <div>
              <div className="course-detail-badges">
                <span className="badge badge-gold">{course.category}</span>
                <span className={`badge ${course.difficulty === "Beginner" ? "badge-green" : course.difficulty === "Intermediate" ? "badge-gold" : "badge-red"}`}>
                  {course.difficulty}
                </span>
              </div>
              <h1 className="course-detail-title">{course.title}</h1>
              <p className="course-detail-desc">{course.description}</p>
              <div className="course-detail-instructor-row">
                <div className="instructor-avatar">
                  {course.instructor?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="instructor-info-name">{course.instructor?.name}</div>
                  <div className="instructor-info-role">Course Instructor</div>
                </div>
              </div>
            </div>

            {/* Enroll panel */}
            <div className="enroll-panel">
              {isEnrolled ? (
                <>
                  <div>
                    <div className="enroll-progress-header">
                      <span className="enroll-prog-label">Your Progress</span>
                      <span className="enroll-prog-val">{enrollment.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                  </div>
                  <div className="enroll-enrolled-badge">
                    ✓ Enrolled in this course
                  </div>
                  {message && <div className="alert alert-success">{message}</div>}
                </>
              ) : (
                <>
                  <div>
                    <div className="enroll-free-label">Free</div>
                    <div className="enroll-free-sub">Full lifetime access</div>
                  </div>
                  {message && <div className="alert alert-error">{message}</div>}
                  {user?.role === "student" ? (
                    <button onClick={handleEnroll} className="btn btn-primary enroll-cta-btn" disabled={enrolling}>
                      {enrolling ? "Enrolling..." : "Enroll Now →"}
                    </button>
                  ) : !user ? (
                    <Link to="/login" className="btn btn-primary enroll-cta-btn">Login to Enroll</Link>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: 300 }}>
                      Instructors cannot enroll in courses.
                    </p>
                  )}
                  <ul className="enroll-checklist">
                    {[
                      `${course.lessons.length} lessons included`,
                      "Progress tracking",
                      "Certificate on completion",
                      "Lifetime access",
                    ].map((item, i) => (
                      <li key={i} className="enroll-check-item">
                        <span className="enroll-check-dot">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="lessons-container">
        <div className="container">
          <div className="lessons-header">
            <h2 className="lessons-title">Course Content</h2>
            <span className="lessons-count">{course.lessons.length} lessons</span>
          </div>

          {course.lessons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◎</div>
              <p>No lessons added yet.</p>
            </div>
          ) : (
            <div className="lessons-list">
              {course.lessons.map((lesson, index) => {
                const isDone = enrollment?.completedLessons?.includes(lesson._id);
                return (
                  <div key={lesson._id} className={`lesson-row ${isDone ? "lesson-done" : ""}`}>
                    <div className="lesson-num">{isDone ? "✓" : index + 1}</div>
                    <div className="lesson-body">
                      <div className="lesson-name">{lesson.title}</div>
                      {isEnrolled && <p className="lesson-text">{lesson.content}</p>}
                      {lesson.duration > 0 && <span className="lesson-dur">⏱ {lesson.duration} min</span>}
                    </div>
                    {isEnrolled ? (
                      <button
                        onClick={() => handleMarkLesson(lesson._id)}
                        className={`btn btn-sm ${isDone ? "btn-ghost" : "btn-primary"}`}
                        disabled={isDone}
                      >
                        {isDone ? "✓ Done" : "Mark Done"}
                      </button>
                    ) : (
                      <span className="lesson-lock">🔒</span>
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