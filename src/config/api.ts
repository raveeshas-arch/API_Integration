// API Configuration
const API_BASE_URL = `http://localhost:${import.meta.env.VITE_API_PORT || '3001'}`;

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  USERS: `${API_BASE_URL}/api/users`,
  ADMIN: `${API_BASE_URL}/api/admin`,
};

// Fetch with credentials for cookie support
export const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

export default API_ENDPOINTS;