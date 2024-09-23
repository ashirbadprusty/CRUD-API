import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService.js';
import { HttpError } from '../middleware/errorHandler.js';
import { IUser } from '../models/userModel.js';
import { IProduct } from '../models/productModel.js';

const productService = new ProductService();

interface AuthenticatedRequest extends Request {
  user?: IUser;  // This ensures we have the correct typing for req.user
}

// Create a new product
export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Ensure the user is available in the request object
    if (!req.user) {
      return next(new HttpError('User not authenticated', 401));
    }

    const productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'> = {
      ...req.body,
      user: req.user?._id,  // Use the authenticated user's ID
    };
    

    const product = await productService.createProduct(productData);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.findProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    if (!updatedProduct) {
      return next(new HttpError('Product not found', 404));
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedProduct = await productService.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return next(new HttpError('Product not found', 404));
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
