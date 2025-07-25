import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quizzes';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchQuizzes(courseId) {
  const res = await axios.get(`${API_URL}/course/${courseId}`, { headers: getAuthHeader() });
  return res.data;
}

export async function createQuiz(data) {
  const res = await axios.post(API_URL, data, { headers: getAuthHeader() });
  return res.data;
}

export async function updateQuiz(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
  return res.data;
}

export async function deleteQuiz(id) {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
}

export async function attemptQuiz(id, answers) {
  const res = await axios.post(`${API_URL}/${id}/attempt`, { answers }, { headers: getAuthHeader() });
  return res.data;
} 