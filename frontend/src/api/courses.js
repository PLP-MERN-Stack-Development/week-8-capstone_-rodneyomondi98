import axios from 'axios';

const API_URL = 'http://localhost:5000/api/courses';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchCourses() {
  const res = await axios.get(API_URL, { headers: getAuthHeader() });
  return res.data;
}

export async function fetchCourse(id) {
  const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
}

export async function createCourse(data) {
  const res = await axios.post(API_URL, data, { headers: getAuthHeader() });
  return res.data;
}

export async function updateCourse(id, data) {
  const res = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
  return res.data;
}

export async function deleteCourse(id) {
  const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return res.data;
}

export async function enrollCourse(id) {
  const res = await axios.post(`${API_URL}/${id}/enroll`, {}, { headers: getAuthHeader() });
  return res.data;
} 