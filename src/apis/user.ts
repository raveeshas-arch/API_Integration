import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;


const apiCall = async (endpoint: string) => {
  try {
    console.log('API Call:', `${BASE_URL}${endpoint}`);
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const fetchProductsList = async () => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return apiCall("/products").then(data => data.products);
};

export const fetchProducts = () => apiCall("/products");

export const fetchProductsCount = () => apiCall("/products").then(data => data.total || 0);