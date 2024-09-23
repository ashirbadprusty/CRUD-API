import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from './errorHandler.js';
import cookieParser from 'cookie-parser'; 

const JWT_SECRET = process.env.JWT_SECRET!;

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new HttpError('No token, authorization denied', 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded; 
    console.log(decoded);
    
    next();
  } catch (err) {
    return next(new HttpError('Token is not valid', 401));
  }
};


export default authMiddleware;
