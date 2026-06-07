// ============================================================
// pages/Home.jsx — Landing Page
// ============================================================
// The first page users see. Shows a hero section and
// quick stats about the platform.
// ============================================================

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content container">
          <div className="hero-badge">🎓 Online Learning Platform</div>
          <h1 className="hero-title">
            Learn Skills That
            <span className="hero-accent"> Matter Today</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of students and instructors on Learn.in —
            a modern platform for creating and taking online courses.
          </p>

          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary">
              Browse Courses →
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline">
                Get Started Free
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="btn btn-outline">
                Go to Dashboard
              </Link>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>100+</strong>
              <span>Courses</span>
            </div>
            <div className="hero-stat">
              <strong>50+</strong>
              <span>Instructors</span>
            </div>
            <div className="hero-stat">
              <strong>1000+</strong>
              <span>Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features container">
        <h2>Why Choose Learn.in?</h2>
        <div className="features-grid">
          {[
            { icon: "🎯", title: "Focused Learning", desc: "Structured courses with lessons and progress tracking." },
            { icon: "👨‍🏫", title: "Expert Instructors", desc: "Learn from real instructors who create quality content." },
            { icon: "📊", title: "Track Progress", desc: "See your progress on every course in your dashboard." },
            { icon: "🔐", title: "Secure Access", desc: "JWT-based auth ensures your account is always safe." },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
