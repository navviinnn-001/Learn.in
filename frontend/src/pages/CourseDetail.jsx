import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Stars = ({ rating, interactive, onRate }) => (
  <div style={{ display: "flex", gap: "3px" }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span
        key={i}
        style={{
          fontSize: interactive ? 24 : 14,
          cursor: interactive ? "pointer" : "default",
          color: i <= Math.round(rating) ? "var(--amber)" : "var(--surface-4)",
          transition: "color 0.1s",
        }}
        onClick={() => interactive && onRate && onRate(i)}
      >★</span>
    ))}
  </div>
);

const AnnouncementForm = ({ courseId, onPost }) => {
  const [form, setForm] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/announcements/${courseId}`, form);
      setForm({ title: "", body: "" });
      setMsg("Posted successfully!");
      onPost();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "22px", marginBottom: "20px" }}>
      <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "14px" }}>Post Announcement</div>
      {msg && <div className="alert alert-success" style={{ fontSize: "12px" }}>{msg}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="Announcement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-textarea" style={{ minHeight: "80px" }} placeholder="Write your message..." value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? "Posting..." : "Post Announcement"}
        </button>
      </form>
    </div>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");

  const loadData = async () => {
    try {
      const [courseRes, reviewRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/reviews/${id}`),
      ]);
      setCourse(courseRes.data.course);
      setReviews(reviewRes.data.reviews);
      setAvgRating(reviewRes.data.avgRating);

      if (user?.role === "student") {
        const eRes = await api.get("/enroll/my-courses");
        const found = eRes.data.enrollments.find(e => e.course?._id === id);
        setEnrollment(found || null);
      }

      if (user) {
        const annRes = await api.get(`/announcements/${id}`);
        setAnnouncements(annRes.data.announcements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/enroll/${id}`);
      const eRes = await api.get("/enroll/my-courses");
      setEnrollment(eRes.data.enrollments.find(e => e.course?._id === id) || null);
      setEnrollMsg("🎉 Successfully enrolled!");
    } catch (err) {
      setEnrollMsg(err.response?.data?.message || "Enrollment failed");
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

  const handleReview = async e => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await api.post(`/reviews/${id}`, reviewForm);
      setReviewMsg("✓ Review submitted!");
      const r = await api.get(`/reviews/${id}`);
      setReviews(r.data.reviews);
      setAvgRating(r.data.avgRating);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!course)  return <div className="container" style={{ paddingTop: 100 }}><p>Course not found.</p></div>;

  const isEnrolled   = !!enrollment;
  const isInstructor = user?.role === "instructor" && course.instructor?._id === user?._id;
  const hasReviewed  = reviews.some(r => r.student?._id === user?._id);

  const tabs = [
    { key: "lessons",       label: `Lessons (${course.lessons.length})` },
    { key: "reviews",       label: `Reviews (${reviews.length})` },
    ...(user ? [{ key: "announcements", label: `Announcements (${announcements.length})` }] : []),
  ];

  return (
    <div style={{ paddingTop: "64px" }}>

      {/* ── HERO ── */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "60px", alignItems: "start" }}>

            {/* Left */}
            <div className="anim-fade-up">
              {/* Breadcrumb */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "20px", fontSize: "12px", color: "var(--text-3)" }}>
                <Link to="/courses" style={{ color: "var(--text-3)", fontWeight: 500 }}>Courses</Link>
                <span>›</span>
                <span style={{ color: "var(--text-2)" }}>{course.category}</span>
              </div>

              {/* Badges */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span className="badge badge-blue">{course.category}</span>
                <span className={`badge ${course.difficulty === "Beginner" ? "badge-green" : course.difficulty === "Intermediate" ? "badge-amber" : "badge-red"}`}>
                  {course.difficulty}
                </span>
                {isEnrolled && <span className="badge badge-teal">Enrolled</span>}
              </div>

              <h1 style={{ fontFamily: "var(--sans)", fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-1)", lineHeight: 1.15, marginBottom: "16px" }}>
                {course.title}
              </h1>

              <p style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "24px" }}>
                {course.description}
              </p>

              {/* Rating + meta */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Stars rating={avgRating} />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)" }}>
                    {avgRating > 0 ? avgRating.toFixed(1) : "No ratings yet"}
                  </span>
                  {reviews.length > 0 && <span style={{ fontSize: "12px", color: "var(--text-3)" }}>({reviews.length} reviews)</span>}
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-3)" }}>📚 {course.lessons.length} lessons</span>
                <span style={{ fontSize: "13px", color: "var(--text-3)" }}>👤 {course.instructor?.name}</span>
              </div>
            </div>

            {/* Enroll panel */}
            <div className="anim-scale-in" style={{ background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: "var(--r-lg)", padding: "28px", position: "sticky", top: "80px" }}>
              {isEnrolled ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-2)" }}>Your Progress</span>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: enrollment.progress === 100 ? "var(--green)" : "var(--blue-light)", letterSpacing: "-0.03em" }}>
                      {enrollment.progress}%
                    </span>
                  </div>
                  <div className="progress-track progress-track-thick" style={{ marginBottom: "16px" }}>
                    <div className="progress-fill" style={{ width: `${enrollment.progress}%`, background: enrollment.progress === 100 ? "var(--green)" : undefined }} />
                  </div>
                  <div className="alert alert-success" style={{ marginBottom: 0, fontSize: "12px" }}>
                    ✓ You're enrolled in this course
                  </div>
                  {enrollment.progress === 100 && (
                    <div style={{ textAlign: "center", padding: "16px", background: "var(--teal-dim)", border: "1px solid rgba(20,184,166,0.25)", borderRadius: "var(--r-sm)", marginTop: "16px" }}>
                      <div style={{ fontSize: "24px", marginBottom: "6px" }}>🏆</div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#2dd4bf" }}>Course Completed!</div>
                      <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "4px" }}>Leave a review in the Reviews tab</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.04em", marginBottom: "4px" }}>Free</div>
                    <div style={{ fontSize: "12px", color: "var(--text-3)" }}>Full lifetime access</div>
                  </div>

                  {enrollMsg && (
                    <div className={`alert ${enrollMsg.startsWith("🎉") ? "alert-success" : "alert-error"}`} style={{ fontSize: "12px" }}>
                      {enrollMsg}
                    </div>
                  )}

                  {user?.role === "student" ? (
                    <button
                      className="btn btn-primary w-full"
                      style={{ padding: "13px", fontSize: "14px", marginBottom: "16px" }}
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? "Enrolling..." : "Enroll Now — Free"}
                    </button>
                  ) : !user ? (
                    <Link to="/login" className="btn btn-primary w-full"
                      style={{ padding: "13px", fontSize: "14px", marginBottom: "16px", display: "flex" }}>
                      Sign in to Enroll
                    </Link>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--text-3)", padding: "12px", background: "var(--surface-2)", borderRadius: "var(--r-xs)", marginBottom: "16px" }}>
                      Instructors cannot enroll in courses.
                    </div>
                  )}
                </>
              )}

              {/* Course includes */}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginTop: isEnrolled ? "16px" : 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
                  This course includes
                </div>
                {[
                  `${course.lessons.length} structured lessons`,
                  "Full progress tracking",
                  "Certificate on completion",
                  "Instructor announcements",
                  "Lifetime access",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", fontSize: "12px", color: "var(--text-2)" }}>
                    <span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="tabs" style={{ marginBottom: "28px" }}>
            {tabs.map(t => (
              <button key={t.key} className={`tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── LESSONS ── */}
          {activeTab === "lessons" && (
            <div className="anim-fade-in">
              {course.lessons.length === 0 ? (
                <div className="empty"><div className="empty-icon">📖</div><div className="empty-title">No lessons yet</div></div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", overflow: "hidden" }}>
                  {course.lessons.map((lesson, idx) => {
                    const done = enrollment?.completedLessons?.includes(lesson._id);
                    return (
                      <div
                        key={lesson._id}
                        style={{
                          background: done ? "rgba(34,197,94,0.04)" : "var(--surface)",
                          borderBottom: idx < course.lessons.length - 1 ? "1px solid var(--border)" : "none",
                          borderLeft: done ? "3px solid var(--green)" : "3px solid transparent",
                          padding: "18px 22px",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "16px",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={e => !done && (e.currentTarget.style.background = "var(--surface-2)")}
                        onMouseLeave={e => !done && (e.currentTarget.style.background = "var(--surface)")}
                      >
                        {/* Number/check */}
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: done ? "rgba(34,197,94,0.15)" : "var(--surface-3)",
                          border: `1px solid ${done ? "rgba(34,197,94,0.3)" : "var(--border-2)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: 700,
                          color: done ? "var(--green)" : "var(--text-3)",
                          flexShrink: 0,
                        }}>
                          {done ? "✓" : idx + 1}
                        </div>
                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)", marginBottom: isEnrolled ? "4px" : 0 }}>
                            {lesson.title}
                          </div>
                          {isEnrolled && (
                            <p style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.6 }}>{lesson.content}</p>
                          )}
                          {lesson.duration > 0 && (
                            <span style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px", display: "block" }}>⏱ {lesson.duration} min</span>
                          )}
                        </div>
                        {/* Action */}
                        {isEnrolled ? (
                          <button
                            className={`btn btn-sm ${done ? "btn-success" : "btn-primary"}`}
                            disabled={done}
                            onClick={() => handleMarkLesson(lesson._id)}
                            style={{ flexShrink: 0 }}
                          >
                            {done ? "✓ Done" : "Mark Done"}
                          </button>
                        ) : (
                          <span style={{ fontSize: "14px", color: "var(--text-4)", flexShrink: 0 }}>🔒</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <div className="anim-fade-in">
              {/* Summary bar */}
              {reviews.length > 0 && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "24px", marginBottom: "24px", display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "48px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.04em", lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
                    <Stars rating={avgRating} />
                    <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "4px" }}>{reviews.length} reviews</div>
                  </div>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-3)", width: "8px" }}>{star}</span>
                          <span style={{ color: "var(--amber)", fontSize: "12px" }}>★</span>
                          <div className="progress-track" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: "var(--amber)" }} />
                          </div>
                          <span style={{ fontSize: "12px", color: "var(--text-3)", width: "24px" }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write a review */}
              {isEnrolled && !hasReviewed && (
                <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "24px", marginBottom: "24px" }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px" }}>Write a Review</div>
                  {reviewMsg && (
                    <div className={`alert ${reviewMsg.startsWith("✓") ? "alert-success" : "alert-error"}`}>{reviewMsg}</div>
                  )}
                  <form onSubmit={handleReview}>
                    <div className="form-group">
                      <label className="form-label">Your Rating</label>
                      <Stars rating={reviewForm.rating} interactive onRate={r => setReviewForm({ ...reviewForm, rating: r })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Review (optional)</label>
                      <textarea className="form-textarea" style={{ minHeight: "80px" }}
                        placeholder="Share your experience with this course..."
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={reviewLoading}>
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">⭐</div>
                  <div className="empty-title">No reviews yet</div>
                  <div className="empty-desc">Be the first to review this course</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {reviews.map(r => (
                    <div key={r._id} className="review-card">
                      <div className="review-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div className="avatar avatar-sm avatar-blue">{r.student?.name?.[0]?.toUpperCase()}</div>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)" }}>{r.student?.name}</div>
                            <Stars rating={r.rating} />
                          </div>
                        </div>
                        <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {r.comment && <p className="review-text">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {activeTab === "announcements" && (
            <div className="anim-fade-in">
              {isInstructor && (
                <AnnouncementForm courseId={id} onPost={async () => {
                  const r = await api.get(`/announcements/${id}`);
                  setAnnouncements(r.data.announcements);
                }} />
              )}
              {announcements.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📢</div>
                  <div className="empty-title">No announcements yet</div>
                  {isInstructor && <div className="empty-desc">Post an announcement above to notify your students</div>}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {announcements.map(a => (
                    <div key={a._id} className="ann-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div className="ann-title">{a.title}</div>
                        {isInstructor && (
                          <button className="btn btn-danger btn-sm" style={{ flexShrink: 0, marginLeft: "12px" }}
                            onClick={async () => {
                              try {
                                await api.delete(`/announcements/${a._id}`);
                                setAnnouncements(prev => prev.filter(x => x._id !== a._id));
                              } catch (err) { console.error(err); }
                            }}>
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="ann-body">{a.body}</p>
                      <div className="ann-meta">
                        By {a.instructor?.name} · {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;