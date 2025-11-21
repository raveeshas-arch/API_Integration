import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct
} from '../controller/productController.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', getAllProducts);

// POST /api/products - Create new product
router.post('/', createProduct);

// GET /api/products/:id - Get single product
router.get('/:id', getProduct);

// PUT /api/products/:id - Update product
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

export default router;