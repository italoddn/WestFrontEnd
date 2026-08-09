import axios from 'axios';

const api = axios.create({
  baseURL: 'https://westbackend-zkds.onrender.comgit'
});

export default api;

// 'https://westbackend-zkds.onrender.com'
