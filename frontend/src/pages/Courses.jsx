import { useState, useEffect } from "react";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses").then(res => {
      setCourses(res.data.courses);
      setFiltered(res.data.courses);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = courses;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    if (category !== "All") result = result.filter(c => c.category === category);
    setFiltered(result);
  }, [search, category, courses]);

  const categories = ["All", ...new Set(courses.map(c => c.category))];

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Explore knowledge</span>
          <h1 className="page-title">All Courses</h1>
          <p className="page-subtitle">Curated courses across disciplines — from beginner to advanced</p>
        </div>

        <div className="courses-topbar">
          <div className="courses-search-wrap">
            <span className="search-icon">⌕</span>
            <input className="courses-search" type="text"
              placeholder="Search courses, categories..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {categories.map(cat => (
              <button key={cat} className={`filter-tab ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
          <span className="courses-count">{filtered.length} courses</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">◎</div>
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((course, i) => (
              <div key={course._id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;