import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Important for cookies/sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    // Don't log 401s as errors if we are just checking auth status
    if (error.response?.status !== 401) {
      console.error('API Error:', message);
    }
    return Promise.reject(error); // Return full error object for handling in context
  }
);

export default axiosClient;
