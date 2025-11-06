import { useQuery } from '@tanstack/react-query';
import { fetchProductsList, fetchProductsCount } from '../apis/user';
import { QUERY_KEYS } from '../constants';

export const useProductsCount = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, 'count'],
    queryFn: fetchProductsCount,
  });
};

export const useProductsList = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, 'list'],
    queryFn: fetchProductsList,
  });
};