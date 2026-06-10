import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const AVATAR_COLORS = ["avatar-blue", "avatar-violet", "avatar-teal", "avatar-amber"];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (p) =>
    pathname === p || pathname.startsWith(p + "/") ? "active" : "";
  const avatarColor = user
    ? AVATAR_COLORS[user.name.charCodeAt(0) % AVATAR_COLORS.length]
    : "avatar-blue";

  return (
    <nav className="navbar">
      <div className="nav-backdrop" />
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          learn<span className="nav-logo-accent">.in</span>
        </Link>

        <div className="nav-links">
          <Link to="/courses" className={`nav-link ${isActive("/courses")}`}>
            Courses
          </Link>
          {user && (
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
              Dashboard
            </Link>
          )}
          {user?.role === "instructor" && (
            <>
              <Link to="/instructor" className={`nav-link ${isActive("/instructor")}`}>
                My Courses
              </Link>
              <Link
                to="/instructor/students"
                className={`nav-link ${isActive("/instructor/students")}`}
              >
                Students
              </Link>
            </>
          )}
        </div>

        <div className="nav-user">
          {user ? (
            <>
              <div className="nav-user-info">
                <span className="nav-user-name">{user.name.split(" ")[0]}</span>
                <span className="nav-user-role">{user.role}</span>
              </div>
              <div className={`nav-avatar avatar ${avatarColor}`}>
                {user.name[0].toUpperCase()}
              </div>
              <button
                className="nav-logout"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;