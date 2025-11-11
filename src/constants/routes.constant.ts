export const ROUTES = {
  DASHBOARD: '/',
  MANUAL: '/manual',
  API: '/api',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// React Query Keys
export const QUERY_KEYS = {
  USERS: ['users'],
  MANUAL_USERS: ['manualUsers'],
} as const;

// Messages
export const MESSAGES = {
  USER_ADDED: 'User added successfully!',
  USER_DELETED: 'User deleted successfully!',
  USER_UPDATED: 'User updated successfully!',
  ERROR: 'Something went wrong',
} as const;

// Loading Component
export { LoaderOne as LOADING_COMPONENT } from '../components/ui/loader';