import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await api.post("/auth/login", formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
            <span className="auth-left-tag">Welcome back</span>
          </div>
          <h2 className="auth-left-title">Continue your<br /><em>learning path</em></h2>
          <p className="auth-left-desc">
            Pick up right where you left off. Your progress, enrollments,
            and certificates are waiting.
          </p>
          <ul className="auth-feature-list">
            {[
              "Access all enrolled courses instantly",
              "Track your progress across subjects",
              "Earn certificates upon completion",
              "Connect with instructors and peers",
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
            <h1 className="auth-greeting">Sign in</h1>
            <p className="auth-subtext">Enter your credentials to continue</p>
          </div>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={formData.email}
                onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="••••••••••" value={formData.password}
                onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch-row">
            New to Learn.in? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;