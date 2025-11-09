const express = require('express');
const { authenticate } = require('../middleware/auth');
const Prediction = require('../models/Prediction');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, predictions: [] });
});

router.get('/student/:studentId/latest', authenticate, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const prediction = await Prediction.findOne({ studentId })
      .sort({ createdAt: -1 })
      .populate('studentId', 'usn profile');
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'No predictions found for this student'
      });
    }
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
});

module.exports = router;