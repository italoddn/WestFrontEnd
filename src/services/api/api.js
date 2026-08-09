import axios from 'axios';

const api = axios.create({
  baseURL: 'https://westbackend-229w.onrender.com'
});

export default api;

// 'https://westbackend-229w.onrender.com'
