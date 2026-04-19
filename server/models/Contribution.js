const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  functionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Function', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guestName: { type: String, required: true },
  guestNameTamil: { type: String },
  guestNameEnglish: { type: String },
  village: { type: String },
  villageTamil: { type: String },
  guestRelation: { type: String },
  relationTamil: { type: String },
  amount: { type: Number, required: true },
  giftType: { type: String, enum: ['cash', 'gold', 'gift', 'other'], default: 'cash' },
  giftDescription: { type: String },
  notes: { type: String },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contribution', ContributionSchema);
