import axios from 'axios';

const api = axios.create({
  baseURL: 'https://westbackend-e76c.onrender.com'
});

export default api;

// 'https://westbackend-e76c.onrender.com'
