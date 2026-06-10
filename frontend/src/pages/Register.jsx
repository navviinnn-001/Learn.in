import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content anim-fade-up">
          <div className="auth-left-logo">learn<span>.in</span></div>
          <h2 className="auth-left-title">Join<br /><em>thousands</em><br />of learners</h2>
          <p className="auth-left-desc">
            Build real skills on a professional platform. Whether you're learning or teaching,
            learn.in has the tools you need.
          </p>
          <ul className="auth-feat-list">
            {[
              "Free forever, no credit card needed",
              "Student or Instructor — your choice",
              "Progress tracking from day one",
              "Earn recognition with course completions",
            ].map((f, i) => (
              <li key={i} className="auth-feat-item">
                <span className="auth-feat-icon">✓</span>{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container anim-scale-in">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Create account</h1>
            <p className="auth-form-subtitle">Free to join. No credit card required.</p>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: "16px" }}>⚠ {error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" type="text" name="name"
                placeholder="John Doe" value={form.name}
                onChange={onChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email}
                onChange={onChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password}
                onChange={onChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">I want to</label>
              <div className="role-picker">
                {[
                  { val: "student",    icon: "🎓", title: "Learn",  sub: "Access courses" },
                  { val: "instructor", icon: "🧑‍🏫", title: "Teach",  sub: "Create courses" },
                ].map(r => (
                  <div
                    key={r.val}
                    className={`role-option ${form.role === r.val ? "selected" : ""}`}
                    onClick={() => setForm({ ...form, role: r.val })}
                  >
                    <span className="role-option-icon">{r.icon}</span>
                    <span className="role-option-title">{r.title}</span>
                    <span className="role-option-sub">{r.sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;