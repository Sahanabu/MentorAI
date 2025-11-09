const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ success: true, backlogs: [] });
});

module.exports = router;