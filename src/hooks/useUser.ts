import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../apis/user';
import { useProductStore } from '../stores/productStore';

const useApiData = (key: string, fetchFn: () => Promise<any>) => {
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
  });
};

export const useProducts = () => {
  const { products, setProducts, isLoaded } = useProductStore();
  
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    enabled: !isLoaded,
  });

  if (query.data && !isLoaded) {
    setProducts(query.data);
  }

  return {
    data: products.length > 0 ? products : query.data,
    isLoading: query.isLoading && !isLoaded,
    error: query.error
  };
};