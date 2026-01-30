// src/lib/api.ts
import axios from 'axios';

// 1. Create the Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Make sure this matches your Django URL
});

// 2. Add the Interceptor (The "Security Guard")
api.interceptors.request.use(
  (config) => {
    // Check if we have a token in storage
    const token = localStorage.getItem('access');
    
    // Debugging: Let's see if the token exists in the console
    console.log("Interceptor running. Token found:", !!token);

    if (token) {
      // Attach the token to the header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;