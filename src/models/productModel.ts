import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './userModel.js';  // Importing IUser for reference

// Define the IProduct interface that extends Mongoose's Document
export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  user: Types.ObjectId | IUser;  // Reference to a User or just ObjectId
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the product schema with typing
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
}, { timestamps: true });

// Export the model with the IProduct interface as the generic type
const ProductModel = model<IProduct>('Product', productSchema);

export default ProductModel;
