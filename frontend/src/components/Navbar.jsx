import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "active" : "";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-bg" />

        <Link to="/" className="nav-logo">
          Learn<span className="nav-logo-dot">.</span>in
        </Link>

        <div className="nav-links">
          <Link to="/courses" className={`nav-link ${isActive("/courses")}`}>Courses</Link>

          {user ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>Dashboard</Link>
              {user.role === "instructor" && (
                <Link to="/instructor" className={`nav-link ${isActive("/instructor")}`}>Studio</Link>
              )}

              <div className="nav-sep" />

              <div className="nav-user">
                <div className="nav-avatar">{user.name[0].toUpperCase()}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span className="nav-name">{user.name.split(" ")[0]}</span>
                  <span className={`nav-role-chip ${user.role}`}>{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ marginLeft: "4px" }}>
                  Exit
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="nav-sep" />
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;