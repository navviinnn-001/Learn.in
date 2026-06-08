import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-left-overline">
            <span className="auth-left-line" />
            <span className="auth-left-tag">Get started</span>
          </div>
          <h2 className="auth-left-title">Begin your<br /><em>journey today</em></h2>
          <p className="auth-left-desc">
            Join thousands of learners and instructors building real skills
            on Learn.in — the premium online learning platform.
          </p>
          <ul className="auth-feature-list">
            {[
              "Free to join, no credit card required",
              "Choose your role: Student or Instructor",
              "Access structured courses with lessons",
              "Track and showcase your learning progress",
            ].map((f, i) => (
              <li key={i} className="auth-feature-item">
                <span className="auth-feature-dot" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap animate-fade-up">
          <div className="auth-form-header">
            <h1 className="auth-greeting">Create account</h1>
            <p className="auth-subtext">Fill in your details to get started</p>
          </div>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" name="name"
                placeholder="John Doe" value={formData.name}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={formData.email}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Min. 6 characters" value={formData.password}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">I am joining as a</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {["student", "instructor"].map(role => (
                  <button key={role} type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    style={{
                      padding: "12px",
                      border: `1px solid ${formData.role === role ? "var(--gold)" : "var(--border)"}`,
                      borderRadius: "var(--radius-xs)",
                      background: formData.role === role ? "var(--gold-dim)" : "var(--surface-2)",
                      color: formData.role === role ? "var(--gold)" : "var(--text-secondary)",
                      cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "13px",
                      fontWeight: "400", transition: "all 0.2s", textTransform: "capitalize",
                    }}>
                    {role === "student" ? "🎓 Student" : "👨‍🏫 Instructor"}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p className="auth-switch-row">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;