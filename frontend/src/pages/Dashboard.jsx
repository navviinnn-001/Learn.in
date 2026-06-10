import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

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
          const [s, e] = await Promise.all([
            api.get("/enroll/dashboard"),
            api.get("/enroll/my-courses"),
          ]);
          setStats(s.data);
          setEnrollments(e.data.enrollments);
        } else {
          const r = await api.get("/courses/instructor/my-courses");
          setInstructorCourses(r.data.courses);
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
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <span className="page-eyebrow">{greet}</span>
              <h1 className="page-title">{user.name.split(" ")[0]}'s Dashboard</h1>
              <p className="page-desc">
                {user.role === "student"
                  ? "Track your learning progress and enrolled courses"
                  : "Manage your courses and monitor student performance"}
              </p>
            </div>
            {user.role === "instructor" && (
              <Link to="/create-course" className="btn btn-primary">+ New Course</Link>
            )}
            {user.role === "student" && (
              <Link to="/courses" className="btn btn-secondary">Browse Courses</Link>
            )}
          </div>
        </div>

        {/* ── STUDENT ── */}
        {user.role === "student" && stats && (
          <>
            <div className="stat-grid anim-fade-up">
              {[
                { label: "Courses Available", value: stats.totalCourses,      color: "var(--blue)" },
                { label: "Enrolled",          value: stats.enrolledCourses,   color: "var(--violet)" },
                { label: "Completed",         value: stats.completedCourses || 0, color: "var(--teal)" },
                { label: "Avg. Progress",     value: stats.averageProgress,   color: "var(--amber)", suffix: "%" },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ "--accent-color": s.color }}>
                  <div className="stat-card-label">{s.label}</div>
                  <div className="stat-card-value">{s.value}{s.suffix && <span>{s.suffix}</span>}</div>
                </div>
              ))}
            </div>

            <div className="section anim-fade-up d-2">
              <div className="section-header">
                <span className="section-title">My Enrollments</span>
                <Link to="/courses" className="btn btn-ghost btn-sm">Browse more →</Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📚</div>
                  <div className="empty-title">No courses yet</div>
                  <div className="empty-desc">Start learning by enrolling in a course</div>
                  <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                  {enrollments.map((e, i) => (
                    <div key={e._id}
                      style={{ background: "var(--surface)", padding: "18px 22px", display: "flex", alignItems: "center", gap: "20px", borderBottom: i < enrollments.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s" }}
                      onMouseEnter={el => el.currentTarget.style.background = "var(--surface-2)"}
                      onMouseLeave={el => el.currentTarget.style.background = "var(--surface)"}>
                      <div style={{ width: 42, height: 42, borderRadius: "var(--r-xs)", background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--serif)", fontSize: "20px", color: "var(--blue-light)", flexShrink: 0 }}>
                        {e.course?.title?.[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.course?.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500 }}>{e.course?.instructor?.name} · {e.course?.category}</div>
                      </div>
                      <div style={{ width: 160, flexShrink: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Progress</span>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: e.progress === 100 ? "var(--green)" : "var(--text-1)" }}>{e.progress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${e.progress}%`, background: e.progress === 100 ? "var(--green)" : undefined }} />
                        </div>
                      </div>
                      {e.progress === 100 && <span className="badge badge-teal">Completed</span>}
                      {e.progress > 0 && e.progress < 100 && <span className="badge badge-blue">In Progress</span>}
                      {e.progress === 0 && <span className="badge badge-gray">Not Started</span>}
                      <Link to={`/courses/${e.course?._id}`} className="btn btn-secondary btn-sm">Continue</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── INSTRUCTOR ── */}
        {user.role === "instructor" && (
          <>
            <div className="stat-grid anim-fade-up">
              {[
                { label: "Courses Created", value: instructorCourses.length, color: "var(--blue)" },
                { label: "Total Lessons",   value: instructorCourses.reduce((s, c) => s + (c.lessons?.length || 0), 0), color: "var(--violet)" },
                { label: "Active Courses",  value: instructorCourses.filter(c => c.lessons?.length > 0).length, color: "var(--teal)" },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ "--accent-color": s.color }}>
                  <div className="stat-card-label">{s.label}</div>
                  <div className="stat-card-value">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="section anim-fade-up d-2">
              <div className="section-header"><span className="section-title">Quick Actions</span></div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link to="/create-course" className="btn btn-primary">+ Create New Course</Link>
                <Link to="/instructor" className="btn btn-secondary">Manage Courses</Link>
                <Link to="/instructor/students" className="btn btn-secondary">View Students</Link>
              </div>
            </div>

            {instructorCourses.length > 0 && (
              <div className="section anim-fade-up d-3">
                <div className="section-header">
                  <span className="section-title">Your Courses</span>
                  <Link to="/instructor" className="btn btn-ghost btn-sm">View all →</Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                  {instructorCourses.slice(0, 5).map((c, i) => (
                    <div key={c._id}
                      style={{ background: "var(--surface)", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", borderBottom: i < Math.min(instructorCourses.length, 5) - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>{c.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>{c.category} · {c.lessons?.length || 0} lessons</div>
                      </div>
                      <span className={`badge ${c.difficulty === "Beginner" ? "badge-green" : c.difficulty === "Intermediate" ? "badge-amber" : "badge-red"}`}>{c.difficulty}</span>
                      <Link to={`/courses/${c._id}`} className="btn btn-ghost btn-sm">View</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;