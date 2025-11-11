import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const registerAdmin = async (adminData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${BASE_URL}/api/admin/register`, adminData);
  return response.data;
};

export const loginAdmin = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${BASE_URL}/api/admin/login`, credentials);
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await axios.post(`${BASE_URL}/api/admin/logout`);
  return response.data;
};