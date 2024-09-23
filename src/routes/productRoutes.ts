import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, createProduct);
router.get('/', getProducts);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
