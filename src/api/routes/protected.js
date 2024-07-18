// routes/protected.js
const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/backend', authenticateToken, (req, res) => {
    res.status(200).send('This is a protected route');
});

module.exports = router;
