const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const SALT_ROUNDS = 10;

async function register(req, res) {
  const { username, password, role, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  const existing = await User.findOne({ username }).exec();
  if (existing) return res.status(409).json({ message: 'username already exists' });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({ username, password: hashed, role: role || 'employee', email });
  await user.save();
  res.status(201).json({ id: user._id, username: user.username, role: user.role, email: user.email, name: user.username });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(401).json({ message: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'invalid credentials' });

  const secret = process.env.JWT_SECRET || '';
  if (!secret) return res.status(500).json({ message: 'JWT secret not configured' });

  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, secret, { expiresIn: '8h' });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, name: user.username } });
}

async function me(req, res) {
  const payload = req.user;
  if (!payload) return res.status(401).json({ message: 'Unauthorized' });
  const user = await User.findById(payload.id).select('-password').exec();
  res.json(user);
}

module.exports = { register, login, me };
