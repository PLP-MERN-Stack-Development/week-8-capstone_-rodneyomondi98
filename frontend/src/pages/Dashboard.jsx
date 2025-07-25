import React, { useEffect, useState } from 'react';
import { fetchCourses, enrollCourse } from '../api/courses';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses()
      .then(setCourses)
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (id) => {
    setEnrolling(id);
    try {
      await enrollCourse(id);
      setCourses(courses => courses.map(c => c._id === id ? { ...c, enrolled: true } : c));
    } catch {
      setError('Enrollment failed');
    }
    setEnrolling(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Courses</h2>
      <ul className="space-y-4">
        {courses.map(course => (
          <li key={course._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">{course.title}</div>
              <div className="text-sm text-gray-600">Instructor: {course.instructor?.name}</div>
              <div className="text-gray-700 mt-2">{course.description}</div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                View
              </button>
              {!course.enrolled && (
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  onClick={() => handleEnroll(course._id)}
                  disabled={enrolling === course._id}
                >
                  {enrolling === course._id ? 'Enrolling...' : 'Enroll'}
                </button>
              )}
              {course.enrolled && <span className="text-green-700 font-semibold ml-2">Enrolled</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 