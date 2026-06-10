import { useState, useEffect } from "react";
import api from "../utils/api";
import CourseCard from "../components/CourseCard";

const SORT_OPTIONS = [
  { value: "newest",  label: "Newest First" },
  { value: "oldest",  label: "Oldest First" },
  { value: "rating",  label: "Top Rated" },
  { value: "lessons", label: "Most Lessons" },
];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        const list = res.data.courses;
        const withRatings = await Promise.all(
          list.map(async (c) => {
            try {
              const r = await api.get(`/reviews/${c._id}`);
              return { ...c, avgRating: r.data.avgRating, totalReviews: r.data.totalReviews };
            } catch {
              return { ...c, avgRating: 0, totalReviews: 0 };
            }
          })
        );
        setCourses(withRatings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let result = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor?.name?.toLowerCase().includes(q)
      );
    }
    if (category !== "All") result = result.filter(c => c.category === category);
    if (difficulty !== "All") result = result.filter(c => c.difficulty === difficulty);
    result.sort((a, b) => {
      if (sort === "newest")  return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")  return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "rating")  return (b.avgRating || 0) - (a.avgRating || 0);
      if (sort === "lessons") return (b.lessons?.length || 0) - (a.lessons?.length || 0);
      return 0;
    });
    setFiltered(result);
  }, [search, category, difficulty, sort, courses]);

  const categories = ["All", ...new Set(courses.map(c => c.category).filter(Boolean))];

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <span className="page-eyebrow">Browse Library</span>
              <h1 className="page-title">All Courses</h1>
              <p className="page-desc">Explore our full catalog of expert-led courses</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
              <input className="form-input" style={{ paddingLeft: "36px" }} type="text"
                placeholder="Search courses, instructors..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: "auto", minWidth: "140px" }} value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-select" style={{ width: "auto", minWidth: "140px" }} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="All">All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <select className="form-select" style={{ width: "auto", minWidth: "150px" }} value={sort} onChange={e => setSort(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text-3)", whiteSpace: "nowrap", marginLeft: "auto" }}>
              {filtered.length} {filtered.length === 1 ? "course" : "courses"}
            </span>
          </div>
          {categories.length > 2 && (
            <div className="chip-row" style={{ marginTop: "14px" }}>
              {categories.map(c => (
                <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No courses found</div>
            <div className="empty-desc">Try adjusting your search or filters</div>
            <button className="btn btn-secondary" onClick={() => { setSearch(""); setCategory("All"); setDifficulty("All"); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((course, i) => (
              <div key={course._id} className="anim-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
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