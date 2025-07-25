import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export async function login(email, password) {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}

export async function register(name, email, password, role) {
  const res = await axios.post(`${API_URL}/register`, { name, email, password, role });
  return res.data;
} 