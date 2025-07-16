const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { Contact } = require('./models');

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const contact = await Contact.create({
      name,
      email
    });
    
    res.status(201).json(contact);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await contact.update({
      name,
      email
    });
    
    res.json(contact);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await contact.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

const startServer = async () => {
  try {
    await require('./models').sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await require('./models').sequelize.sync();
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