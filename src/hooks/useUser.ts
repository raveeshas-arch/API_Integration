import { useQuery } from '@tanstack/react-query';
import { fetchProductsList, fetchProductsCount, fetchProductCategoriesCount, fetchTopRatedProducts } from '../apis/user';
import { QUERY_KEYS } from '../constants';

export const useProductsCount = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, 'count'],
    queryFn: fetchProductsCount,
  });
};

export const useProductCategoriesCount = () => {
    return useQuery({
        queryKey: [...QUERY_KEYS.USERS, 'categories-count'],
        queryFn: fetchProductCategoriesCount,
    });
};

export const useProductsList = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, 'list'],
    queryFn: fetchProductsList,
  });
};

export const useTopRatedProducts = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, 'top-rated'],
    queryFn: fetchTopRatedProducts,
  });
};