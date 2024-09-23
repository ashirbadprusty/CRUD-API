import User from '../models/userModel.js';

export class UserService {
  async createUser(data: { name: string; email: string; password: string;  }) {
    const user = new User(data);
    return await user.save();
  }

  async findUserByEmail(email: string) {
    return await User.findOne({ email });
  }
}
