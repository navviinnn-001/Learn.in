// ============================================================
// components/CourseCard.jsx — Reusable Course Card
// ============================================================
// A reusable component that displays a course in a card format.
// Used in both the Courses page and Instructor panel.
// Props: course, onDelete (optional), showEnroll (optional)
// ============================================================

import { Link } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course, onDelete, showActions }) => {
  const difficultyColor = {
    Beginner: "badge-green",
    Intermediate: "badge-orange",
    Advanced: "badge-blue",
  };

  return (
    <div className="course-card">
      {/* Thumbnail or placeholder */}
      <div className="course-thumb">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className="course-thumb-placeholder">
            <span>{course.title[0]}</span>
          </div>
        )}
        <span className={`badge ${difficultyColor[course.difficulty]}`}>
          {course.difficulty}
        </span>
      </div>

      <div className="course-card-body">
        <span className="course-category">{course.category}</span>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>

        <div className="course-meta">
          <span>👨‍🏫 {course.instructor?.name || "Unknown"}</span>
          <span>📚 {course.lessons?.length || 0} lessons</span>
        </div>

        <div className="course-actions">
          <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
            View Course
          </Link>

          {/* Instructor actions — show only if passed as prop */}
          {showActions && (
            <>
              <Link to={`/edit-course/${course._id}`} className="btn btn-outline btn-sm">
                Edit
              </Link>
              <button
                onClick={() => onDelete(course._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
