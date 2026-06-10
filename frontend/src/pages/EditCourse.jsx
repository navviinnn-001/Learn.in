import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import CourseForm from "./CourseForm";

const EditCourse = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(res => setCourseData(res.data.course))
      .catch(() => setError("Failed to load course"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (error)   return (
    <div className="page">
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    </div>
  );

  return (
    <CourseForm
      isEdit
      courseId={id}
      initialData={{
        title:       courseData.title,
        description: courseData.description,
        category:    courseData.category,
        difficulty:  courseData.difficulty,
        thumbnail:   courseData.thumbnail || "",
      }}
      initialLessons={
        courseData.lessons?.length > 0
          ? courseData.lessons
          : [{ title: "", content: "", duration: 0 }]
      }
    />
  );
};

export default EditCourse;