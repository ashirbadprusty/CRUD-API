import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import  cookieParser  from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(rateLimiter);
app.use(cookieParser());

app.get('/', (req,res)=>{
    res.send('Welcome to the server')
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use(errorHandler); // Central error handling

export default app;
