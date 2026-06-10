import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const ProgressBar = ({ value }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "140px" }}>
    <div className="progress-track" style={{ flex: 1 }}>
      <div className="progress-fill" style={{ width: `${value}%`, background: value === 100 ? "var(--green)" : undefined }} />
    </div>
    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-2)", minWidth: "32px", textAlign: "right" }}>{value}%</span>
  </div>
);

const InstructorStudents = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    api.get("/enroll/instructor/students")
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;
  if (!data) return <div className="container" style={{ paddingTop: 100 }}><p>Failed to load data.</p></div>;

  const { courses, totalStudents, totalEnrollments } = data;

  // Build unique student list for "all" view
  const allStudents = [];
  courses.forEach(c => {
    c.students.forEach(s => {
      const existing = allStudents.find(x => x._id?.toString() === s._id?.toString());
      if (!existing) {
        allStudents.push({ ...s, courses: [{ title: c.title, progress: s.progress }] });
      } else {
        existing.courses.push({ title: c.title, progress: s.progress });
      }
    });
  });

  const activeCourse = selectedCourse === "all" ? null : courses.find(c => c._id.toString() === selectedCourse);
  const displayStudents = activeCourse ? activeCourse.students : allStudents;

  const filtered = displayStudents
    .filter(s => !searchQ || s.name?.toLowerCase().includes(searchQ.toLowerCase()) || s.email?.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name")           return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "progress_desc")  return b.progress - a.progress;
      if (sortBy === "progress_asc")   return a.progress - b.progress;
      if (sortBy === "enrolled")       return new Date(b.enrolledAt) - new Date(a.enrolledAt);
      return 0;
    });

  const completedCount  = displayStudents.filter(s => s.progress === 100).length;
  const inProgressCount = displayStudents.filter(s => s.progress > 0 && s.progress < 100).length;
  const avgProgress = displayStudents.length
    ? Math.round(displayStudents.reduce((sum, s) => sum + s.progress, 0) / displayStudents.length)
    : 0;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <span className="page-eyebrow">Instructor Studio</span>
              <h1 className="page-title">Student Analytics</h1>
              <p className="page-desc">Track enrollment and progress across all your courses</p>
            </div>
            <Link to="/instructor" className="btn btn-secondary">← My Courses</Link>
          </div>
        </div>

        {/* Top stats */}
        <div className="stat-grid anim-fade-up">
          {[
            { label: "Total Students",     value: totalStudents,       color: "var(--blue)" },
            { label: "Total Enrollments",  value: totalEnrollments,    color: "var(--violet)" },
            { label: "Completed",          value: completedCount,      color: "var(--teal)" },
            { label: "Avg. Progress",      value: avgProgress, suffix: "%", color: "var(--amber)" },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ "--accent-color": s.color }}>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}{s.suffix && <span>{s.suffix}</span>}</div>
            </div>
          ))}
        </div>

        {/* Course filter chips */}
        <div className="section anim-fade-up d-2">
          <div className="section-header">
            <span className="section-title">Filter by Course</span>
          </div>
          <div className="chip-row">
            <button className={`chip ${selectedCourse === "all" ? "active" : ""}`} onClick={() => setSelectedCourse("all")}>
              All Courses ({totalStudents} students)
            </button>
            {courses.map(c => (
              <button key={c._id} className={`chip ${selectedCourse === c._id.toString() ? "active" : ""}`} onClick={() => setSelectedCourse(c._id.toString())}>
                {c.title} ({c.totalEnrolled})
              </button>
            ))}
          </div>
        </div>

        {/* Progress breakdown (per course) */}
        {activeCourse && (
          <div className="anim-fade-up d-2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
            {[
              { label: "Completed",   count: activeCourse.students.filter(s => s.progress === 100).length,                        badge: "badge-teal" },
              { label: "In Progress", count: activeCourse.students.filter(s => s.progress > 0 && s.progress < 100).length,       badge: "badge-blue" },
              { label: "Not Started", count: activeCourse.students.filter(s => s.progress === 0).length,                          badge: "badge-amber" },
            ].map((item, i) => (
              <div key={i} className="card" style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-2)" }}>{item.label}</span>
                  <span className={`badge ${item.badge}`}>{item.count}</span>
                </div>
                <div className="progress-track" style={{ height: "4px" }}>
                  <div className="progress-fill" style={{ width: `${activeCourse.students.length ? Math.round(item.count / activeCourse.students.length * 100) : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Students table */}
        <div className="section anim-fade-up d-3">
          <div className="section-header">
            <span className="section-title">
              {activeCourse ? `Students in "${activeCourse.title}"` : "All Students"} ({filtered.length})
            </span>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
              <span style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: "13px", pointerEvents: "none" }}>🔍</span>
              <input className="form-input" style={{ paddingLeft: "32px" }} type="text"
                placeholder="Search by name or email..." value={searchQ}
                onChange={e => setSearchQ(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: "auto", minWidth: "160px" }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Sort: Name A–Z</option>
              <option value="progress_desc">Sort: Highest Progress</option>
              <option value="progress_asc">Sort: Lowest Progress</option>
              <option value="enrolled">Sort: Recently Enrolled</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">👥</div>
              <div className="empty-title">{searchQ ? "No students match your search" : "No students enrolled yet"}</div>
              <div className="empty-desc">{!searchQ && "Share your courses to attract students"}</div>
            </div>
          ) : (
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    {!activeCourse && <th>Courses</th>}
                    {activeCourse  && <th>Lessons Done</th>}
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(student => {
                    const progress = activeCourse
                      ? student.progress
                      : student.courses
                        ? Math.round(student.courses.reduce((s, c) => s + c.progress, 0) / student.courses.length)
                        : student.progress;
                    const status = progress === 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
                    return (
                      <tr key={student._id || student.email}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="avatar avatar-sm avatar-blue">{student.name?.[0]?.toUpperCase()}</div>
                            <span style={{ fontWeight: 600 }}>{student.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-3)" }}>{student.email}</td>
                        {!activeCourse && (
                          <td>
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                              {student.courses?.map((c, i) => (
                                <span key={i} className="badge badge-gray" style={{ fontSize: "10px" }}>
                                  {c.title.substring(0, 20)}{c.title.length > 20 ? "…" : ""}
                                </span>
                              ))}
                            </div>
                          </td>
                        )}
                        {activeCourse && (
                          <td style={{ color: "var(--text-2)", fontWeight: 500 }}>
                            {student.completedLessons} / {student.totalLessons}
                          </td>
                        )}
                        <td><ProgressBar value={progress} /></td>
                        <td>
                          {status === "completed"   && <span className="badge badge-teal">Completed</span>}
                          {status === "in_progress" && <span className="badge badge-blue">In Progress</span>}
                          {status === "not_started" && <span className="badge badge-gray">Not Started</span>}
                        </td>
                        <td style={{ color: "var(--text-3)", fontSize: "12px" }}>
                          {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Per-course breakdown (all view) */}
        {selectedCourse === "all" && courses.length > 0 && (
          <div className="section anim-fade-up d-4">
            <div className="section-header"><span className="section-title">Course Breakdown</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
              {courses.map((c, i) => (
                <div key={c._id}
                  style={{ background: "var(--surface)", padding: "18px 22px", display: "flex", alignItems: "center", gap: "20px", borderBottom: i < courses.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)", marginBottom: "3px" }}>{c.title}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{c.totalLessons} lessons</div>
                  </div>
                  <div style={{ textAlign: "center", minWidth: "60px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em" }}>{c.totalEnrolled}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Students</div>
                  </div>
                  <div style={{ width: "160px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "6px" }}>Avg. Progress</div>
                    <ProgressBar value={c.avgProgress} />
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCourse(c._id.toString())}>
                    View Students →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorStudents;