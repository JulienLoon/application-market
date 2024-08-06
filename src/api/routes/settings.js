// /routes/settings.js

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Endpoint to get the current registration status
router.get('/registration', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT setting_value FROM settings WHERE setting_key = "registration_enabled"');
        const registrationEnabled = rows.length > 0 && rows[0].setting_value === '1';
        res.json({ registration_enabled: registrationEnabled });
    } catch (error) {
        console.error('Error fetching registration status:', error);
        res.status(500).json({ message: 'Failed to fetch registration status' });
    }
});

// Endpoint to update the registration status
router.put('/registration', async (req, res) => {
    const { registration_enabled } = req.body;
    try {
        await pool.query('UPDATE settings SET setting_value = ? WHERE setting_key = "registration_enabled"', [registration_enabled]);
        res.json({ message: 'Registration setting updated' });
    } catch (error) {
        console.error('Error updating registration status:', error);
        res.status(500).json({ message: 'Failed to update registration status' });
    }
});

module.exports = router;
