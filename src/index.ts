import cluster from 'cluster';
import os from 'os';
import mongoose from 'mongoose';
import app from './app.js';
import logger from './logger.js';

const PORT = process.env.PORT || 5000;
const numCPUs = os.cpus().length;

// MongoDB connection function
const connectToMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    logger.error('MONGO_URI environment variable is not set');
    process.exit(1); // Exit the process if MONGO_URI is not defined
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};


if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart the worker
  });
} else {
  // Connect to MongoDB in each worker before starting the server
  connectToMongoDB().then(() => {
    app.listen(PORT, () => {
      logger.info(`Worker ${process.pid} running on port ${PORT}`);
    });
  });
}
