const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, assessments: [] });
});

module.exports = router;