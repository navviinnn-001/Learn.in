import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === "student") {
          const [sRes, eRes] = await Promise.all([
            api.get("/enroll/dashboard"),
            api.get("/enroll/my-courses"),
          ]);
          setStats(sRes.data);
          setEnrollments(eRes.data.enrollments);
        } else {
          const res = await api.get("/courses/instructor/my-courses");
          setInstructorCourses(res.data.courses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  if (loading) return <div className="spinner" />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ paddingTop: "12px" }}>
          <span className="eyebrow">{greeting}</span>
          <h1 className="dashboard-greeting">
            Welcome back, <em>{user.name.split(" ")[0]}</em>
          </h1>
          <p className="dashboard-subtext">
            {user.role === "student"
              ? "Here's a snapshot of your learning journey"
              : "Your instructor studio — manage and create courses"}
          </p>
        </div>

        {user.role === "student" && stats && (
          <div className="stats-row animate-fade-up">
            <div className="stat-card">
              <div className="stat-number">{stats.totalCourses}</div>
              <div className="stat-label">Total Courses Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.enrolledCourses}</div>
              <div className="stat-label">Courses Enrolled</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.averageProgress}<span style={{ fontSize: "24px" }}>%</span></div>
              <div className="stat-label">Average Progress</div>
            </div>
          </div>
        )}

        {user.role === "instructor" && (
          <div className="stats-row animate-fade-up">
            <div className="stat-card">
              <div className="stat-number">{instructorCourses.length}</div>
              <div className="stat-label">Courses Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{instructorCourses.reduce((s, c) => s + (c.lessons?.length || 0), 0)}</div>
              <div className="stat-label">Total Lessons Published</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{instructorCourses.filter(c => c.lessons?.length > 0).length}</div>
              <div className="stat-label">Active Courses</div>
            </div>
          </div>
        )}

        {user.role === "student" && (
          <div className="animate-fade-up delay-2">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div className="section-label" style={{ flex: 1, marginBottom: 0 }}>My Enrolled Courses</div>
              <Link to="/courses" className="btn btn-ghost btn-sm" style={{ marginLeft: "16px" }}>Browse more →</Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◎</div>
                <h3>No courses yet</h3>
                <p>Enroll in a course to start your journey</p>
                <Link to="/courses" className="btn btn-primary mt-4">Browse Courses</Link>
              </div>
            ) : (
              <div className="enrollment-list">
                {enrollments.map(e => (
                  <div key={e._id} className="enrollment-row">
                    <div className="enroll-info">
                      <div className="enroll-title">{e.course?.title}</div>
                      <div className="enroll-meta">{e.course?.instructor?.name} · {e.course?.category}</div>
                    </div>
                    <div className="enroll-progress">
                      <div className="enroll-progress-row">
                        <span className="enroll-pct-label">Progress</span>
                        <span className="enroll-pct-val">{e.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${e.progress}%` }} />
                      </div>
                    </div>
                    <Link to={`/courses/${e.course?._id}`} className="btn btn-outline btn-sm">Continue</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user.role === "instructor" && (
          <div className="animate-fade-up delay-2">
            <div className="section-label">Quick Actions</div>
            <div className="instructor-quick-actions">
              <Link to="/create-course" className="btn btn-primary">+ Create New Course</Link>
              <Link to="/instructor" className="btn btn-outline">Manage Courses →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;