const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config');
const { initializeDatabase, User } = require('./models');
const auth = require('./auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize authentication
auth.initialize(app);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MS365 SSO demo API running' });
});

// Protected route example: return the current user's token claims
app.get('/api/profile', auth.requireAuth(), (req, res) => {
  res.json({ user: req.user });
});

// Protected route with scope check: only users with api.read scope can access
app.get('/api/users', auth.requireAuth(['api.read']), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email'] });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected route to create a user (requires api.write scope)
app.post('/api/users', auth.requireAuth(['api.write']), async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await User.create({ username, email });
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server only after DB is ready
initializeDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});