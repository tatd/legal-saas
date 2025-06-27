import express, { Request, Response } from 'express';
import db from './db';
import * as authService from 'services/auth.service';
import { CreateUserData } from 'types';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Health check ok' });
});

// Create a new user
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const data: CreateUserData = req.body;
  const user = await authService.createUser(db.knex(), data);
  res.status(201).json(user);
});

// Get all users
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await db
      .knex()
      .select('id', 'email', 'firm_name', 'created_at')
      .from('users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Unknown error' });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.initialize();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
