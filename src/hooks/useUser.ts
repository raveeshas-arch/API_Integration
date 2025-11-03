import { useQuery } from '@tanstack/react-query';
import {  fetchProducts } from '../apis/user';

// Generic reusable hook
const useApiData = (key: string, fetchFn: () => Promise<any>) => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
  });
};


export const useProducts = () => useApiData('products', fetchProducts);