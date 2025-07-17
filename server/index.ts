import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import { User, Contact } from './models';
import { authenticateToken } from './middleware/auth';
import { AuthRequest, LoginRequest, RegisterRequest, CreateContactRequest, UpdateContactRequest } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

app.post('/auth/register', async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }
    
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      res.status(400).json({ error: 'Username or email already exists' });
      return;
    }
    
    const user = await User.create({
      username,
      email,
      password
    });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/auth/login', async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const isValidPassword = await user.validatePassword(password);
    
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/contacts', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.findAll({
      where: { userId: req.user!.id },
      order: [['created_at', 'DESC']]
    });
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/contacts', authenticateToken, async (req: AuthRequest<{}, {}, CreateContactRequest>, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    
    const contact = await Contact.create({
      name,
      email,
      userId: req.user!.id
    });
    
    res.status(201).json(contact);
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/contacts/:id', authenticateToken, async (req: AuthRequest<{id: string}, {}, UpdateContactRequest>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
    
    const contact = await Contact.findOne({
      where: { id, userId: req.user!.id }
    });
    
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    await contact.update({
      name,
      email
    });
    
    res.json(contact);
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/contacts/:id', authenticateToken, async (req: AuthRequest<{id: string}>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findOne({
      where: { id, userId: req.user!.id }
    });
    
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    await contact.destroy();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

const startServer = async (): Promise<void> => {
  try {
    const { sequelize } = await import('./models');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();