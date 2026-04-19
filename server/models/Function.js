const mongoose = require('mongoose');

const FunctionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'marriage', 'engagement', 'reception', 'nalangu',
      'valaikappu', 'naming', 'earPiercing', 'birthday1st', 'birthday', 'puberty',
      'sathabhisekam', 'bheemaRatha', 'achievement',
      'houseWarming', 'shopOpening',
      'templeEvent', 'annaprashan', 'upanayana',
      'other'
    ], 
    required: true 
  },
  date: { type: Date, required: true },
  groomName: { type: String },
  brideName: { type: String },
  honoree: { type: String },
  venue: { type: String },
  images: [{ type: String }],
  status: { type: String, enum: ['draft', 'active', 'archived'], default: 'active' },
  totalContributions: { type: Number, default: 0 },
  guestCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Function', FunctionSchema);
