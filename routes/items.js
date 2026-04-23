const express = require('express');
const Item    = require('../models/Item');
const User    = require('../models/User');
const guard   = require('../middleware/auth');
const { sendMatchEmail, sendReportConfirmEmail } = require('../utils/mailer');

const router = express.Router();

// ── GET /api/items  (public, with optional filters) ──
router.get('/', async (req, res) => {
  try {
    const { q, type, location } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (location)   filter.location = { $regex: location, $options: 'i' };
    if (q) {
      filter.$or = [
        { name:     { $regex: q, $options: 'i' } },
        { desc:     { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ];
    }

    const items = await Item.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── POST /api/items  (protected) ─────────────
router.post('/', guard, async (req, res) => {
  try {
    const { type, name, desc, location, date, category, contact, icon, image } = req.body;
    if (!type || !name || !desc || !location || !date || !contact)
      return res.status(400).json({ msg: 'Missing required fields' });

    const item = await Item.create({
      type, name, desc, location, date,
      category: category || 'General',
      contact, icon: icon || '📦',
      image: image || '',
      user: req.userId
    });
    await item.populate('user', 'name email');

    // Send confirmation email
    const reporter = await User.findById(req.userId);
    sendReportConfirmEmail(reporter.email, reporter.name, item.name, item.type);

    // Check for matches and send match email
    const opposite = item.type === 'lost' ? 'found' : 'lost';
    const allItems = await Item.find({ type: opposite, resolved: false }).populate('user','name email');
    for (const other of allItems) {
      const nameWords = item.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const otherWords = other.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const common = nameWords.filter(w => otherWords.some(o => o.includes(w) || w.includes(o)));
      if (common.length > 0) {
        // Notify both users
        sendMatchEmail(reporter.email, reporter.name, item.name, other.name);
        if (other.user?.email) {
          sendMatchEmail(other.user.email, other.user.name, other.name, item.name);
        }
        break;
      }
    }

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── GET /api/items/:id  (public) ─────────────
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── DELETE /api/items/:id  (protected, own item) ──
router.delete('/:id', guard, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    if (item.user.toString() !== req.userId)
      return res.status(403).json({ msg: 'Not authorised' });

    await item.deleteOne();
    res.json({ msg: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── PATCH /api/items/:id/resolve  (protected) ──
router.patch('/:id/resolve', guard, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    if (item.user.toString() !== req.userId)
      return res.status(403).json({ msg: 'Not authorised' });

    item.resolved = true;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── GET /api/items/user/mine  (protected) ────
router.get('/user/mine', guard, async (req, res) => {
  try {
    const items = await Item.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── PATCH /api/items/:id/resolve  (protected) already exists above ──

module.exports = router;
