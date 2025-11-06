import axios from "axios";

const BASE_URL = "https://dummyjson.com";


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

export const fetchProducts = () => apiCall("/products");
export const fetchProductsList = () => apiCall("/products").then(data => data.products);
export const fetchProductsCount = () => apiCall("/products").then(data => data.total || 0);