import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "/api"}/auth`,
});

// LOGIN (Accepts identifier + password)
export const loginUser = (data) => API.post("/login", data);

// SIGNUP (Accepts username, email, password, otp)
export const registerUser = (data) => API.post("/register", data);

// SEND OTP (Accepts email)
export const sendOtp = (data) => API.post("/send-otp", data);

// VERIFY EMAIL (Accepts userId, email, otp)
export const verifyEmail = (data) => API.post("/verify-email", data);
