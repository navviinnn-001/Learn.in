// ============================================================
// App.jsx — Root Component with Routing
// ============================================================
// This is the "skeleton" of the app.
// React Router handles navigation between pages without reloading.
//
// <Routes> contains all page mappings:
//   /           → Home page
//   /login      → Login page
//   /register   → Register page
//   /dashboard  → Dashboard (protected)
//   /courses    → All courses
//   /courses/:id → Single course detail
//   /instructor → Instructor panel (protected + instructor only)
//   /create-course → Create course form (protected + instructor only)
//   /edit-course/:id → Edit course form (protected + instructor only)
// ============================================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import InstructorPanel from "./pages/InstructorPanel";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";

function App() {
  return (
    // AuthProvider wraps everything so all components can access auth state
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          {/* Protected Routes — any logged-in user */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          {/* Protected + Instructor only */}
          <Route path="/instructor" element={
            <PrivateRoute role="instructor"><InstructorPanel /></PrivateRoute>
          } />
          <Route path="/create-course" element={
            <PrivateRoute role="instructor"><CreateCourse /></PrivateRoute>
          } />
          <Route path="/edit-course/:id" element={
            <PrivateRoute role="instructor"><EditCourse /></PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
