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
import InstructorStudents from "./pages/InstructorStudents";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/instructor" element={
            <PrivateRoute role="instructor"><InstructorPanel /></PrivateRoute>
          } />
          <Route path="/instructor/students" element={
            <PrivateRoute role="instructor"><InstructorStudents /></PrivateRoute>
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