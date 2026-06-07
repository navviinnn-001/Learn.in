// ============================================================
// pages/Courses.jsx — All Courses Listing Page
// ============================================================
// Public page — any visitor can see all courses.
// Has a search bar to filter courses by title or category.
// Uses the CourseCard component to display each course.
// ============================================================

import { useState, useEffect } from "react";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);     // all courses from API
  const [filtered, setFiltered] = useState([]);  // filtered list for search
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch all courses when page loads
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.courses);
        setFiltered(res.data.courses);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses whenever search or category changes
  useEffect(() => {
    let result = courses;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((c) => c.category === category);
    }

    setFiltered(result);
  }, [search, category, courses]);

  // Extract unique categories from course list
  const categories = ["All", ...new Set(courses.map((c) => c.category))];

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>All Courses</h1>
          <p>{filtered.length} courses available</p>
        </div>

        {/* Search + Filter */}
        <div className="courses-filter">
          <input
            type="text"
            className="search-input"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-tab ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
