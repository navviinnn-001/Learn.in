import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "📐", title: "Structured Learning", desc: "Step-by-step lessons with clear objectives and progress tracking built in." },
  { icon: "🎓", title: "Expert-Led Courses", desc: "Learn directly from instructors who create curated, in-depth content." },
  { icon: "📊", title: "Live Analytics", desc: "Instructors see real-time enrollment data, student progress, and ratings." },
  { icon: "🔐", title: "Secure Access", desc: "JWT authentication with role-based permissions keeps your account safe." },
  { icon: "⭐", title: "Student Reviews", desc: "Honest ratings and reviews help students find the best courses." },
  { icon: "📢", title: "Announcements", desc: "Instructors post course updates; students stay informed in real-time." },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div style={{ paddingTop: "64px" }}>
      {/* Hero */}
      <section style={{
        padding: "100px 0 80px",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ textAlign: "center" }}>
          <div className="anim-fade-up">
            <span style={{
              display: "inline-block",
              background: "var(--blue-dim)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: "var(--r-full)",
              padding: "5px 16px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--blue-light)",
              marginBottom: "28px",
              letterSpacing: "-0.01em",
            }}>
              🚀 Professional Learning Platform
            </span>
          </div>

          <h1 className="anim-fade-up d-1" style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
            marginBottom: "24px",
            color: "var(--text-1)",
          }}>
            Learn skills that<br />
            <em style={{ fontStyle: "italic", color: "var(--blue-light)" }}>move careers forward</em>
          </h1>

          <p className="anim-fade-up d-2" style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "var(--text-2)",
            fontWeight: 400,
            maxWidth: "560px",
            margin: "0 auto 44px",
            lineHeight: 1.7,
          }}>
            A professional online learning platform with real progress tracking,
            instructor analytics, student reviews, and structured course delivery.
          </p>

          <div className="anim-fade-up d-3" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/courses" className="btn btn-primary btn-lg">Explore Courses</Link>
            {!user
              ? <Link to="/register" className="btn btn-ghost btn-lg">Create Free Account →</Link>
              : <Link to="/dashboard" className="btn btn-secondary btn-lg">Go to Dashboard →</Link>
            }
          </div>

          {/* Stats strip */}
          <div className="anim-fade-up d-4" style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            marginTop: "60px",
            paddingTop: "40px",
            borderTop: "1px solid var(--border)",
            flexWrap: "wrap",
          }}>
            {[["500+", "Students"], ["48", "Courses"], ["12", "Instructors"], ["98%", "Satisfaction"]].map(([n, l], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.04em", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "4px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--blue)", letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
              Platform features
            </span>
            <h2 style={{ fontFamily: "var(--sans)", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text-1)" }}>
              Everything you need to learn &amp; teach
            </h2>
          </div>

          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={i} className={`card anim-fade-up d-${Math.min(i + 1, 6)}`} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ fontSize: "24px" }}>{f.icon}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em" }}>{f.title}</div>
                <div style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.65, fontWeight: 400 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ padding: "80px 0", textAlign: "center" }}>
          <div className="container">
            <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 500, letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Start your journey today
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-2)", marginBottom: "36px" }}>
              Free to join. No credit card required.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
              <Link to="/courses" className="btn btn-secondary btn-lg">Browse Courses</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;