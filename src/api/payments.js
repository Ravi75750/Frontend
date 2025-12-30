import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "/api"}/payments`,
});

// Create payment order
export const createOrder = (data) => API.post("/create-order", data);

// Verify payment signature
export const verifyPayment = (data) => API.post("/verify-payment", data);

// Get full payment history
export const getPaymentHistory = (userId) => API.get(`/history/${userId}`);
