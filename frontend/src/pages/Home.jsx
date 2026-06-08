import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const CATEGORIES = [
  { icon: "⚡", name: "Web Development", count: "24 courses" },
  { icon: "🧠", name: "Data Science", count: "18 courses" },
  { icon: "🎨", name: "Design", count: "12 courses" },
  { icon: "📱", name: "Mobile Apps", count: "9 courses" },
];

const FEATURES = [
  { title: "Expert Instructors", desc: "Learn from industry professionals who bring real-world experience to every lesson." },
  { title: "Structured Paths", desc: "Follow curated learning paths from beginner to advanced, with clear milestones." },
  { title: "Progress Tracking", desc: "Monitor your growth in real-time with detailed progress analytics on your dashboard." },
  { title: "Secure Platform", desc: "JWT-based authentication ensures your learning data stays private and protected." },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-ambient" />
        <div className="hero-grid" />

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-overline">
              <span className="hero-overline-line" />
              <span className="hero-overline-text">Online Learning Platform</span>
            </div>

            <h1 className="hero-title">
              Master skills that<br />
              <span className="hero-title-italic">define careers</span>
            </h1>

            <p className="hero-description">
              A premium learning environment where world-class instructors and
              ambitious students converge. Build expertise that lasts.
            </p>

            <div className="hero-actions">
              <Link to="/courses" className="btn btn-primary btn-lg">Explore Courses</Link>
              {!user ? (
                <Link to="/register" className="btn btn-outline btn-lg">Join Free →</Link>
              ) : (
                <Link to="/dashboard" className="btn btn-outline btn-lg">My Dashboard →</Link>
              )}
            </div>

            <div className="hero-stats-strip">
              {[
                { num: "500+", desc: "Students Enrolled" },
                { num: "48", desc: "Expert Courses" },
                { num: "12", desc: "Instructors" },
                { num: "98%", desc: "Satisfaction Rate" },
              ].map((s, i) => (
                <div key={i}>
                  <span className="hero-stat-num">{s.num}</span>
                  <span className="hero-stat-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <div className="hero-card-tag">// Your learning overview</div>
              <div className="hero-card-title">Dashboard Preview</div>
              <div className="hero-card-sub">Current progress across enrolled courses</div>

              {[
                { label: "Advanced React Patterns", pct: 74 },
                { label: "Data Structures & Algorithms", pct: 42 },
                { label: "UI/UX Design Fundamentals", pct: 91 },
              ].map((item, i) => (
                <div key={i} className="hero-progress-item">
                  <div className="hero-progress-meta">
                    <span className="hero-progress-label">{item.label}</span>
                    <span className="hero-progress-pct">{item.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}

              <div className="hero-card-divider" />
              <div className="hero-card-metrics">
                <div className="hero-metric">
                  <span className="hero-metric-val">3</span>
                  <span className="hero-metric-label">Enrolled</span>
                </div>
                <div className="hero-metric">
                  <span className="hero-metric-val">69%</span>
                  <span className="hero-metric-label">Avg Progress</span>
                </div>
              </div>
            </div>

            <div className="hero-float">
              <div className="hero-float-icon">🏆</div>
              <div className="hero-float-text">
                <strong>Lesson Complete</strong>
                <span>Advanced Hooks — 2m ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">Explore by field</span>
              <h2 className="section-title">Browse <em>categories</em></h2>
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">View all courses</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link to="/courses" key={i} className="category-item">
                <span className="category-icon">{cat.icon}</span>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="features-strip">
        <div className="container">
          <div className="section-header" style={{ marginBottom: "48px" }}>
            <div>
              <span className="eyebrow">Why Learn.in</span>
              <h2 className="section-title">Built for <em>serious</em> learners</h2>
            </div>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-bar" />
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="home-cta">
          <div className="container">
            <span className="eyebrow" style={{ display: "block", textAlign: "center", marginBottom: "24px" }}>Start today</span>
            <h2 className="cta-title">
              Ready to begin your<br />
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>learning journey?</em>
            </h2>
            <p className="cta-sub">Join thousands of students. Access premium content. Track your progress.</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/courses" className="btn btn-outline btn-lg">Browse Courses</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;