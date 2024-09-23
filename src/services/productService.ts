import ProductModel, { IProduct } from '../models/productModel.js';

export class ProductService {
  async createProduct(data: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
    const product = new ProductModel(data);
    return await product.save();
  }

  async findProducts(): Promise<IProduct[]> {
    return await ProductModel.find();
  }

  async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id: string): Promise<IProduct | null> {
    return await ProductModel.findByIdAndDelete(id);
  }
}
