import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../middleware/errorHandler.js";
import { UserService } from "../services/userService.js";

const userService = new UserService();
const JWT_SECRET = process.env.JWT_SECRET!;

// Cookie options
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  maxAge: 3600000,
  secure: true,
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    let user = await userService.findUserByEmail(email);

    if (user) {
      return next(new HttpError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // Store the token in a cookie
    res.cookie("token", token, cookieOptions);
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return next(new HttpError("Invalid credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new HttpError("Invalid credentials", 400));
    }

    // Include user ID in the token
    const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // Store the token in a cookie
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};
