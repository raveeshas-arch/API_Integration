import { useQuery } from '@tanstack/react-query';
import { fetchUsers, fetchProducts } from '../apis/user';

// Generic reusable hook
const useApiData = (key: string, fetchFn: () => Promise<any>) => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
  });
};

// Simple hooks using the generic one
export const useUsers = () => useApiData('users', fetchUsers);
export const useProducts = () => useApiData('products', fetchProducts);