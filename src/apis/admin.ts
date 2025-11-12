import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create axios instance only for admin API with credentials
const adminAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export const registerAdmin = async (adminData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await adminAPI.post("/api/admin/register", adminData);
  return response.data;
};

export const loginAdmin = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await adminAPI.post("/api/admin/login", credentials);
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await adminAPI.post("/api/admin/logout");
  return response.data;
};