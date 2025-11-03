export const ROUTES = {
  MANUAL: '/manual',
  API: '/api',
} as const;

// React Query Keys
export const QUERY_KEYS = {
  USERS: ['users'],
  MANUAL_USERS: ['manualUsers'],
} as const;

// Messages
export const MESSAGES = {
  LOADING: 'Loading...',
  USER_ADDED: 'User added successfully!',
  USER_DELETED: 'User deleted successfully!',
  USER_UPDATED: 'User updated successfully!',
  ERROR: 'Something went wrong',
} as const;

// API URLs
export const API_URLS = {
  USERS: 'https://dummyjson.com/users',
} as const;