import axios from 'axios';

const api = axios.create({
  baseURL: 'https://westbackend-zkds.onrender.com'
});

export default api;

// 'https://westbackend-zkds.onrender.com'
