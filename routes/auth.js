const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const guard   = require('../middleware/auth');

const router = express.Router();

const makeToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ─────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    if (password.length < 6)
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });

    if (await User.findOne({ email }))
      return res.status(400).json({ msg: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: makeToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── POST /api/auth/login ────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ msg: 'Invalid email or password' });

    res.json({
      token: makeToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── GET /api/auth/me ────────────────────────
router.get('/me', guard, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email, photo: user.photo || '', isAdmin: user.isAdmin || false });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── PATCH /api/auth/photo  (update profile photo) ───
router.patch('/photo', guard, async (req, res) => {
  try {
    const { photo } = req.body;
    await User.findByIdAndUpdate(req.userId, { photo });
    res.json({ msg: 'Photo updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── GET /api/auth/admin/users  (admin only) ──
router.get('/admin/users', guard, async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me.isAdmin) return res.status(403).json({ msg: 'Admin only' });
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
