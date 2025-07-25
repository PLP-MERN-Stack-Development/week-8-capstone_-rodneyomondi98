import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Quiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/quizzes/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => setError('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (i, value) => {
    setAnswers(a => {
      const copy = [...a];
      copy[i] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await axios.post(`http://localhost:5000/api/quizzes/${id}/attempt`, { answers }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setScore(res.data.score);
    } catch {
      setError('Submission failed');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      {score !== null ? (
        <div className="text-green-700 text-xl font-semibold">Your Score: {score} / {quiz.questions.length}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div key={i} className="border rounded p-4">
              <div className="font-semibold mb-2">{q.question}</div>
              <div className="space-y-1">
                {q.options.map(opt => (
                  <label key={opt} className="block">
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleChange(i, opt)}
                      className="mr-2"
                      required
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
} 