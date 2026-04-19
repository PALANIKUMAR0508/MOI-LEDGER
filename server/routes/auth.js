const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'moi_ledger_secret_2024';

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { username: req.body.username, email: req.body.email });
    
    let { username, email, password } = req.body;
    
    // Trim and normalize inputs
    username = username?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    
    if (!username || !email || !password) {
      console.log('Registration failed: Missing fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Hashing password with length:', password.length);
    const hashed = await bcrypt.hash(password, 12);
    console.log('Password hashed, length:', hashed.length, 'starts with:', hashed.substring(0, 7));
    
    const user = new User({ username, email, password: hashed });
    await user.save();
    
    console.log('User registered successfully:', user._id);

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email, rawPassword: req.body.password });
    
    let { email, password } = req.body;
    
    // Trim and normalize inputs - MUST match registration
    email = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();
    
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', { id: user._id, email: user.email, hasPassword: !!user.password });
    console.log('Stored password hash length:', user.password?.length);
    console.log('Stored password starts with:', user.password?.substring(0, 7));
    console.log('Input password (trimmed) length:', trimmedPassword?.length);
    console.log('Input password (raw) length:', password?.length);

    // Try with trimmed password first
    let isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log('Password match result (trimmed):', isMatch);
    
    // If trimmed doesn't work, try with original password
    if (!isMatch && trimmedPassword !== password) {
      console.log('Trying with original (non-trimmed) password...');
      isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result (original):', isMatch);
    }
    
    if (!isMatch) {
      console.log('Login failed: Password mismatch for user:', user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', user._id);
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

// Change password
const auth = require('../middleware/auth');
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
