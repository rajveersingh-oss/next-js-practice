// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/posts', // your API route
  headers: { 'Content-Type': 'application/json' },
});

export default api;
