import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types/Product';

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      isLoaded: false,
      setProducts: (products: Product[]) => set({ products, isLoaded: true }),
      setIsLoaded: (loaded: boolean) => set({ isLoaded: loaded })
    }),
    { name: 'products-store' }
  )
);