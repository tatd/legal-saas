import express, { Request, Response } from 'express';
import db from './db';
import * as authService from 'services/auth.service';
import { CreateUserData } from 'types';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Health check ok' });
});

// Create a new user
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const data: CreateUserData = req.body;
  const user = await authService.createUser(db.knex(), data);
  res.status(201).json(user);
});

// Login and get token
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, firmName, password } = req.body;
    const result = await authService.login(db.knex(), email, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Return authenticated user info
app.get('/api/auth/me', (req: Request, res: Response): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = authService.validateToken(authHeader);
    res.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token has expired') {
        res.status(401).json({ error: 'Token has expired' });
        return;
      }
      if (error.message === 'Invalid token') {
        res.status(401).json({ error: 'Invalid token' });
        return;
      }
    }
    console.error('Error in /api/auth/me:', error);
    res.status(401).json({ error: 'Failed to authenticate' });
  }
});

// Get list of customers
// app.get('/api/customers')

// Get all users
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await db
      .knex()
      .select('id', 'email', 'firm_name', 'created_at')
      .from('users');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Error handling middleware
app.use((error: Error, req: Request, res: Response) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Unknown error' });
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
