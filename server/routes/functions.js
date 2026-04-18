const router = require('express').Router();
const auth = require('../middleware/auth');
const Function = require('../models/Function');
const Contribution = require('../models/Contribution');

// Get all functions for user
router.get('/', auth, async (req, res) => {
  try {
    const functions = await Function.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(functions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single function
router.get('/:id', auth, async (req, res) => {
  try {
    const fn = await Function.findOne({ _id: req.params.id, userId: req.user.id });
    if (!fn) return res.status(404).json({ message: 'Function not found' });
    res.json(fn);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create function
router.post('/', auth, async (req, res) => {
  try {
    const fn = new Function({ ...req.body, userId: req.user.id });
    await fn.save();
    res.status(201).json(fn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update function
router.put('/:id', auth, async (req, res) => {
  try {
    const fn = await Function.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!fn) return res.status(404).json({ message: 'Function not found' });
    res.json(fn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete function
router.delete('/:id', auth, async (req, res) => {
  try {
    await Function.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    await Contribution.deleteMany({ functionId: req.params.id });
    res.json({ message: 'Function deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const functions = await Function.find({ userId: req.user.id });
    const totalContributions = functions.reduce((s, f) => s + f.totalContributions, 0);
    const totalGuests = functions.reduce((s, f) => s + f.guestCount, 0);
    res.json({
      totalFunctions: functions.length,
      totalContributions,
      totalGuests,
      activeFunctions: functions.filter(f => f.status === 'active').length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
