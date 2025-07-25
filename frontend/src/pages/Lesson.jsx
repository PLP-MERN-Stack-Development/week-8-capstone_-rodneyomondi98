import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Lesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/lessons/${id}`)
      .then(res => setLesson(res.data))
      .catch(() => setError('Failed to load lesson'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!lesson) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
      {lesson.videoUrl && (
        <div className="mb-4">
          <video src={lesson.videoUrl} controls className="w-full rounded" />
        </div>
      )}
      <div className="text-gray-700 whitespace-pre-line">{lesson.content}</div>
    </div>
  );
} 