import { ROUTES } from './routes.constant';

export const NAV_ITEMS = [
  {
    title: 'API Users',
    href: ROUTES.API,
    description: 'Users from API with React Query',
  },
  {
    title: 'Manual Users', 
    href: ROUTES.MANUAL,
    description: 'Manually managed users with React Query',
  },
] as const;

// Button Labels
export const BUTTONS = {
  REFRESH: 'Refresh',
  ADD_USER: 'Add User',
  DELETE: 'Delete',
  EDIT: 'Edit',
  VIEW: 'View',
  SAVE: 'Save',
  CANCEL: 'Cancel',
} as const;

// Table Headers
export const TABLE_HEADERS = {
  NAME: 'Name',
  EMAIL: 'Email',
  PHONE: 'Phone',
  GENDER: 'Gender',
  ACTIONS: 'Actions',
} as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
] as const;