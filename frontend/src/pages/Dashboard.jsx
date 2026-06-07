// ============================================================
// pages/Dashboard.jsx — User Dashboard
// ============================================================
// Shows different content based on user role:
//   - Student: stats (total courses, enrolled, avg progress) + enrolled courses
//   - Instructor: link to their courses + quick actions
//
// useEffect runs when component mounts to fetch data from API.
// ============================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  // State for student dashboard
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  // State for instructor dashboard
  const [instructorCourses, setInstructorCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === "student") {
          // Fetch stats and enrolled courses in parallel
          const [statsRes, enrollRes] = await Promise.all([
            api.get("/enroll/dashboard"),
            api.get("/enroll/my-courses"),
          ]);
          setStats(statsRes.data);
          setEnrollments(enrollRes.data.enrollments);
        } else {
          // Instructor: fetch their own courses
          const res = await api.get("/courses/instructor/my-courses");
          setInstructorCourses(res.data.courses);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.role]);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Hello, {user.name} 👋</h1>
          <p>
            {user.role === "student"
              ? "Here's your learning progress"
              : "Manage your courses and track engagement"}
          </p>
        </div>

        {/* ====== STUDENT DASHBOARD ====== */}
        {user.role === "student" && (
          <>
            {/* Stats Row */}
            {stats && (
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-number">{stats.totalCourses}</div>
                  <div className="stat-label">📚 Total Courses Available</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.enrolledCourses}</div>
                  <div className="stat-label">✅ Courses Enrolled</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.averageProgress}%</div>
                  <div className="stat-label">📈 Average Progress</div>
                </div>
              </div>
            )}

            {/* Enrolled Courses */}
            <div className="flex-between mb-4">
              <h2>My Enrolled Courses</h2>
              <Link to="/courses" className="btn btn-outline btn-sm">Browse More</Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="empty-state">
                <h3>No enrollments yet</h3>
                <p>Explore our courses and enroll today!</p>
                <Link to="/courses" className="btn btn-primary mt-4">Browse Courses</Link>
              </div>
            ) : (
              <div className="enrollment-list">
                {enrollments.map((e) => (
                  <div key={e._id} className="enrollment-item">
                    <div className="enrollment-info">
                      <h3>{e.course?.title}</h3>
                      <p>
                        By {e.course?.instructor?.name} ·{" "}
                        {e.course?.category}
                      </p>
                    </div>
                    <div className="enrollment-progress">
                      <div className="flex-between mb-2">
                        <span className="progress-label">Progress</span>
                        <span className="progress-pct">{e.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${e.progress}%` }}
                        />
                      </div>
                    </div>
                    <Link to={`/courses/${e.course?._id}`} className="btn btn-outline btn-sm">
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ====== INSTRUCTOR DASHBOARD ====== */}
        {user.role === "instructor" && (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-number">{instructorCourses.length}</div>
                <div className="stat-label">📖 Courses Created</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {instructorCourses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)}
                </div>
                <div className="stat-label">🎬 Total Lessons</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {instructorCourses.filter(c => c.lessons?.length > 0).length}
                </div>
                <div className="stat-label">✅ Active Courses</div>
              </div>
            </div>

            <div className="instructor-actions">
              <Link to="/create-course" className="btn btn-primary">
                + Create New Course
              </Link>
              <Link to="/instructor" className="btn btn-outline">
                Manage Courses
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
