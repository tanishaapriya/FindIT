const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type:     { type: String, enum: ['lost', 'found'], required: true },
  name:     { type: String, required: true, trim: true },
  desc:     { type: String, required: true },
  location: { type: String, required: true },
  date:     { type: String, required: true },
  category: { type: String, default: 'General' },
  contact:  { type: String, required: true },
  icon:     { type: String, default: '📦' },
  image:    { type: String, default: '' },   // base64 compressed image (optional)
  resolved: { type: Boolean, default: false },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
