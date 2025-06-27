import express, { Request, Response, NextFunction } from 'express';
import db from './db';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customers.routes';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Health check ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);


// Error handling middleware
app.use((error: Error, req: Request, res: Response) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.initialize();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
