// ============================================================
// components/Navbar.jsx — Top Navigation Bar
// ============================================================
// Shows different links based on whether the user is logged in
// and what their role is (student or instructor).
// useNavigate() is used to redirect after logout.
// ============================================================

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          Learn<span>.in</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/courses" className="nav-link">Courses</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>

              {/* Instructor-only link */}
              {user.role === "instructor" && (
                <Link to="/instructor" className="nav-link">My Courses</Link>
              )}

              {/* User info + logout */}
              <div className="nav-user">
                <span className="nav-username">{user.name}</span>
                <span className={`nav-role ${user.role}`}>{user.role}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
