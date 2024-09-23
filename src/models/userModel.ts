import { Schema, model, Document } from 'mongoose';

// Define the IUser interface that extends the Document interface from Mongoose
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema using IUser
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Export the model with the IUser interface as the generic type
const UserModel = model<IUser>('User', userSchema);

export default UserModel;
