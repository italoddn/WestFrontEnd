import axios from 'axios';

const api = axios.create({
  baseURL: 'https://estudos-r15e.onrender.com'
});

export default api;