import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct
} from '../controller/productController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products - Get all products
router.get('/',  requireAuth, getAllProducts);

// POST /api/products - Create new product
router.post('/', requireAuth, createProduct);

// GET /api/products/:id - Get single product
router.get('/:id', requireAuth, getProduct);

// PUT /api/products/:id - Update product
router.put('/:id', requireAuth, updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', requireAuth, deleteProduct);

export default router;