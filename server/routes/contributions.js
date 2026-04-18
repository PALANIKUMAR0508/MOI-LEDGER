const router = require('express').Router();
const auth = require('../middleware/auth');
const Contribution = require('../models/Contribution');
const Function = require('../models/Function');

// Get contributions for a function
router.get('/function/:functionId', auth, async (req, res) => {
  try {
    const contributions = await Contribution.find({ functionId: req.params.functionId, userId: req.user.id }).sort({ recordedAt: -1 });
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add contribution
router.post('/', auth, async (req, res) => {
  try {
    const contribution = new Contribution({ ...req.body, userId: req.user.id });
    await contribution.save();
    // Update function totals
    const all = await Contribution.find({ functionId: req.body.functionId });
    const total = all.reduce((s, c) => s + c.amount, 0);
    await Function.findByIdAndUpdate(req.body.functionId, { totalContributions: total, guestCount: all.length });
    res.status(201).json(contribution);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete contribution
router.delete('/:id', auth, async (req, res) => {
  try {
    const c = await Contribution.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (c) {
      const all = await Contribution.find({ functionId: c.functionId });
      const total = all.reduce((s, x) => s + x.amount, 0);
      await Function.findByIdAndUpdate(c.functionId, { totalContributions: total, guestCount: all.length });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// Update contribution
router.put('/:id', auth, async (req, res) => {
  try {
    const c = await Contribution.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!c) return res.status(404).json({ message: 'Contribution not found' });
    // Recalculate totals
    const all = await Contribution.find({ functionId: c.functionId });
    const total = all.reduce((s, x) => s + x.amount, 0);
    await Function.findByIdAndUpdate(c.functionId, { totalContributions: total, guestCount: all.length });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
