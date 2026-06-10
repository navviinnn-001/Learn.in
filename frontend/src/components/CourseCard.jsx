import { Link } from "react-router-dom";

const DIFF_BADGE = {
  Beginner:     "badge-green",
  Intermediate: "badge-amber",
  Advanced:     "badge-red",
};

const StarDisplay = ({ rating }) => (
  <div style={{ display: "flex", gap: "1px" }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ fontSize: 12, color: i <= Math.round(rating) ? "var(--amber)" : "var(--surface-4)" }}>★</span>
    ))}
  </div>
);

const CourseCard = ({ course, onDelete, showActions }) => {
  const avg = course.avgRating || 0;
  const total = course.totalReviews || 0;

  return (
    <div
      style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--r)", overflow: "hidden", display: "flex",
        flexDirection: "column", transition: "border-color 0.25s, transform 0.25s var(--ease-out), box-shadow 0.25s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-2)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: "170px", background: "var(--surface-2)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--surface-2), var(--surface-3))" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: "64px", fontWeight: 500, color: "var(--blue)", opacity: 0.2, lineHeight: 1 }}>
              {course.title[0]}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <span className={`badge ${DIFF_BADGE[course.difficulty] || "badge-gray"}`}>{course.difficulty}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
          {course.category}
        </span>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: "15px", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
          {course.title}
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {course.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
          <StarDisplay rating={avg} />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-2)" }}>
            {avg > 0 ? avg.toFixed(1) : "—"}
          </span>
          {total > 0 && <span style={{ fontSize: "11px", color: "var(--text-3)" }}>({total})</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingTop: "8px", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
          <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500 }}>👤 {course.instructor?.name || "—"}</span>
          <span style={{ fontSize: "11px", color: "var(--text-3)" }}>📚 {course.lessons?.length || 0} lessons</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "0 20px 18px", display: "flex", gap: "8px" }}>
        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          View Course
        </Link>
        {showActions && (
          <>
            <Link to={`/edit-course/${course._id}`} className="btn btn-ghost btn-sm">Edit</Link>
            <button onClick={() => onDelete(course._id)} className="btn btn-danger btn-sm">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;