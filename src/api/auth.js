import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api"}/auth`,
});

// LOGIN
export const loginUser = (data) => API.post("/login", data);

// SIGNUP
export const registerUser = (data) => API.post("/register", data);
