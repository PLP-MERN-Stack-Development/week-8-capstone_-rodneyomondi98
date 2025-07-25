import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourse } from '../api/courses';
import { fetchLessons } from '../api/lessons';
import { fetchQuizzes } from '../api/quizzes';

export default function Course() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCourse(id),
      fetchLessons(id),
      fetchQuizzes(id)
    ])
      .then(([course, lessons, quizzes]) => {
        setCourse(course);
        setLessons(lessons);
        setQuizzes(quizzes);
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
      <div className="mb-2 text-gray-700">{course.description}</div>
      <div className="mb-4 text-sm text-gray-600">Instructor: {course.instructor?.name}</div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Lessons</h3>
      <ul className="list-disc ml-6 mb-4">
        {lessons.map(lesson => (
          <li key={lesson._id} className="mb-1">
            <button className="text-blue-600 hover:underline" onClick={() => navigate(`/lessons/${lesson._id}`)}>
              {lesson.title}
            </button>
          </li>
        ))}
        {lessons.length === 0 && <li className="text-gray-500">No lessons yet.</li>}
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">Quizzes</h3>
      <ul className="list-disc ml-6 mb-4">
        {quizzes.map(quiz => (
          <li key={quiz._id} className="mb-1">
            <button className="text-blue-600 hover:underline" onClick={() => navigate(`/quizzes/${quiz._id}`)}>
              Quiz {quiz._id.slice(-4)}
            </button>
          </li>
        ))}
        {quizzes.length === 0 && <li className="text-gray-500">No quizzes yet.</li>}
      </ul>
    </div>
  );
} 