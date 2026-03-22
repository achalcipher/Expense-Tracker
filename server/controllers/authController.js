const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const { v4: uuid } = require('uuid');
const { users } = require('../store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    if (users.find(u => u.email === email))
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(),
      username,
      email,
      password: hashed,
      budgets: { Grocery: 0, Vehicle: 0, Shopping: 0, Travel: 0, Food: 0, Fun: 0, Other: 0 },
    };
    users.push(user);

    const token = generateToken(user);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, budgets: user.budgets },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = users.find(u => u.email === email);
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, budgets: user.budgets },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login };
