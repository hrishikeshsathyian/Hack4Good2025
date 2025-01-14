import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", // Replace with your base API URL
  timeout: 10000, // Set timeout to 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
