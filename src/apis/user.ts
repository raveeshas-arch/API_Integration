import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const EXTERNAL_API = "https://dummyjson.com";

export const fetchUsers = async () => {
  const response = await axios.get(`${BASE_URL}/api/users`);
  return response.data;
};

export const addUser = async (userData: any) => {
  const response = await axios.post(`${BASE_URL}/api/users`, userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await axios.put(`${BASE_URL}/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/api/users/${id}`);
  return response.data;
};

export const fetchProductsList = async () => {
  await new Promise(resolve => setTimeout(resolve, 900));
  const response = await axios.get(`${EXTERNAL_API}/products`);
  return response.data.products;
};

export const fetchProducts = async () => {
  const response = await axios.get(`${EXTERNAL_API}/products`);
  return response.data;
};

export const fetchProductsCount = async () => {
  const response = await axios.get(`${EXTERNAL_API}/products`);
  return response.data.total || 0;
};