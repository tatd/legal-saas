import express, { Request, Response } from 'express';
import db from './db';
import * as authService from 'services/auth.service';
import * as customersService from 'services/customers.service';
import { authenticateToken } from './middleware/auth.middleware';
import { CreateCustomerData, CreateUserData } from 'types';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Health check ok' });
});

// Create a new user
// TODO add try/catch and error handling
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const data: CreateUserData = req.body;
  const user = await authService.createUser(data);
  res.status(201).json(user);
});

// Login and get token
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
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
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const customers = await customersService.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers: ', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create customer
app.post('/api/customers', authenticateToken, async (req, res) => {
  const data: CreateCustomerData = req.body;
  // TODO validate body data
  const customer = await customersService.createCustomer(data);
  res.status(201).json(customer);
});

// Get a single customer by id
app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const customer = await customersService.getCustomer(id);
    res.json(customer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Customer not found') {
      res.status(404).json({ error: 'Customer not found' });
    } else {
      console.error('Error fetching customer:', error);
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  }
});

// Update a single customer
app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      res.status(400).json({ error: 'No update data provided' });
      return;
    }

    const customer = await customersService.updateCustomer(id, updateData);
    res.json(customer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Error updating customer') {
      res.status(400).json({ error: 'Error updating customer' });
    } else {
      console.error('Error updating customer:', error);
      res.status(500).json({ error: 'Failed to update customer' });
    }
  }
});

// Delete a single customer
app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const id = +req.params.id;
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const customer = await customersService.deleteCustomer(id);
    res.json(customer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Error deleting customer') {
      res.status(400).json({ error: 'Error deleting customer' });
    } else {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  }
});

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
