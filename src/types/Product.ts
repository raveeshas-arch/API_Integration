export interface Product {
  _id?: string;
  id: number;
  productName: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  rating: number;
  image?: string;
}