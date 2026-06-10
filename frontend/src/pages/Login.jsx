import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content anim-fade-up">
          <div className="auth-left-logo">learn<span>.in</span></div>
          <h2 className="auth-left-title">Welcome<br /><em>back</em></h2>
          <p className="auth-left-desc">
            Continue your learning journey. Your progress and enrollments are right where you left them.
          </p>
          <ul className="auth-feat-list">
            {[
              "Access all enrolled courses",
              "Track progress across subjects",
              "View announcements from instructors",
              "Rate and review completed courses",
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
            <h1 className="auth-form-title">Sign in</h1>
            <p className="auth-form-subtitle">Enter your credentials to continue</p>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: "16px" }}>⚠ {error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email}
                onChange={onChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Your password" value={form.password}
                onChange={onChange} required />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;