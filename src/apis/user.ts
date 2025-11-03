import axios from "axios";

const BASE_URL = "https://dummyjson.com";

// Generic API function
const apiCall = async (endpoint: string) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`);
  return response.data;
};

export const fetchUsers = () => apiCall("/users").then(data => data.users);
export const fetchProducts = () => apiCall("/products").then(data => data.products);