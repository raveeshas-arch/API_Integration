import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const EXTERNAL_API = "https://dummyjson.com";

// separate axios instances
const internalAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true 
});

// External API instance (dummyjson)
const externalAPI = axios.create({
  baseURL: EXTERNAL_API,
  withCredentials: false 
});

//Fetch limited product list
export const fetchProductsList = async () => {
  await new Promise(resolve => setTimeout(resolve, 900));
  const response = await externalAPI.get("/products");
  return response.data.products;
};

// Fetch all products from external API
export const fetchProducts = async () => {
  const response = await externalAPI.get("/products");
  return response.data;
};








// GET all users from backend
export const fetchUsers = async () => {
  const response = await internalAPI.get("/api/users");
  return response.data;
};

// Add a new user to the backend
export const addUser = async (userData: any) => {
  const response = await internalAPI.post("/api/users", userData);
  return response.data;
};
//update user from backnd
export const updateUser = async (id: string, userData: any) => {
  const response = await internalAPI.put(`/api/users/${id}`, userData);
  return response.data;
};

//delete user from backend
export const deleteUser = async (id: string) => {
  const response = await internalAPI.delete(`/api/users/${id}`);
  return response.data;
};




export const fetchProductsCount = async () => {

  const response = await externalAPI.get("/products");

  return response.data.total || 0;

};

export const fetchProductCategoriesCount = async () => {

  const response = await externalAPI.get("/products/categories");

  return response.data.length || 0;

};

export const fetchTopRatedProducts = async () => {
  const response = await externalAPI.get("/products");
  return response.data.products.sort((a: any, b: any) => b.rating - a.rating).slice(0, 10);
};
