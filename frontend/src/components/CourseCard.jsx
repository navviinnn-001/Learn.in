import { Link } from "react-router-dom";
import "./CourseCard.css";

const difficultyMap = {
  Beginner: "badge-green",
  Intermediate: "badge-gold",
  Advanced: "badge-red",
};

const CourseCard = ({ course, onDelete, showActions }) => {
  return (
    <div className="course-card">
      <div className="course-thumb">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="course-thumb-placeholder">
            <span className="thumb-letter">{course.title[0]}</span>
          </div>
        )}
        <div className="thumb-badge-wrap">
          <span className={`badge ${difficultyMap[course.difficulty] || "badge-gold"}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      <div className="course-card-body">
        <span className="course-cat">{course.category}</span>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>

        <div className="course-meta-row">
          <span className="course-meta-item">
            <span>Instructor</span>
            <span style={{ color: "var(--text-secondary)" }}>{course.instructor?.name || "—"}</span>
          </span>
          <span className="course-meta-dot" />
          <span className="course-meta-item">
            <span>{course.lessons?.length || 0} lessons</span>
          </span>
        </div>
      </div>

      <div className="course-actions">
        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          View Course
        </Link>
        {showActions && (
          <>
            <Link to={`/edit-course/${course._id}`} className="btn btn-outline btn-sm">Edit</Link>
            <button onClick={() => onDelete(course._id)} className="btn btn-danger btn-sm">Del</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;