import { Router } from 'express';
import * as customersService from 'services/customers.service';
import * as mattersService from 'services/matters.service';
import { CreateCustomerData, CreateMatterData } from 'types';
import { authenticateToken } from 'middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await customersService.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get a single customer
router.get('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const customer = await customersService.getCustomer(id);
    res.json(customer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Customer not found') {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const createCustomerData: CreateCustomerData = {
      name: name.trim(),
      phoneNumber: phoneNumber?.trim()
    };

    const newCustomer = await customersService.createCustomer(
      createCustomerData
    );
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const { name, phoneNumber, isActive } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const updateData = {
      id,
      name: name.trim(),
      phoneNumber: phoneNumber?.trim(),
      isActive: isActive !== undefined ? Boolean(isActive) : true
    };

    const updatedCustomer = await customersService.updateCustomer(
      id,
      updateData
    );
    res.json(updatedCustomer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Error updating customer') {
      res.status(400).json({ error: 'Error updating customer' });
      return;
    }
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete a customer (soft delete, update isActive to false)
router.delete('/:id', async (req, res) => {
  try {
    const id = +req.params.id;
    if (isNaN(id) || id <= 0) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const deletedCustomer = await customersService.deleteCustomer(id);
    res.json(deletedCustomer);
  } catch (error) {
    if (error instanceof Error && error.message === 'Error deleting customer') {
      res.status(400).json({ error: 'Error deleting customer' });
      return;
    }
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Matter routes for a specific customer
router.post('/:customerId/matters', async (req, res) => {
  try {
    const customerId = +req.params.customerId;
    const { name, description } = req.body;

    if (isNaN(customerId) || customerId <= 0) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    if (
      !description ||
      typeof description !== 'string' ||
      description.trim() === ''
    ) {
      res.status(400).json({ error: 'Description is required' });
      return;
    }

    const createMatterData: CreateMatterData = {
      name: name.trim(),
      description: description?.trim(),
      customerId
    };

    const matter = await mattersService.createMatter(createMatterData);
    res.status(201).json(matter);
  } catch (error) {
    console.error('Error creating matter:', error);
    res.status(500).json({ error: 'Failed to create matter' });
  }
});

// Get all matters for a customer
router.get('/:customerId/matters', async (req, res) => {
  try {
    const customerId = +req.params.customerId;

    if (isNaN(customerId) || customerId <= 0) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    const matters = await mattersService.getMatters(customerId);
    res.json(matters);
  } catch (error) {
    console.error('Error fetching matters:', error);
    res.status(500).json({ error: 'Failed to fetch matters' });
  }
});

// Get a single matter for a customer
router.get('/:customerId/matters/:matterId', async (req, res) => {
  try {
    const customerId = +req.params.customerId;
    const matterId = +req.params.matterId;

    if (isNaN(customerId) || customerId <= 0) {
      res.status(400).json({ error: 'Invalid customer ID' });
      return;
    }

    if (isNaN(matterId) || matterId <= 0) {
      res.status(400).json({ error: 'Invalid matter ID' });
      return;
    }

    const matter = await mattersService.getMatter(matterId);

    if (matter.customerId !== customerId) {
      res.status(404).json({ error: 'Matter not found for this customer' });
      return;
    }

    res.json(matter);
  } catch (error) {
    console.error('Error fetching matter:', error);

    if (error instanceof Error) {
      if (error.message.includes('Matter not found')) {
        res.status(404).json({ error: 'Matter not found' });
        return;
      }
    }

    res.status(500).json({ error: 'Failed to fetch matter' });
  }
});

export default router;
