// /routes/settings.js

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const authenticateToken = require('../middleware/auth');

// Endpoint om de huidige registratie status op te halen
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

// Endpoint om de registratie status bij te werken
router.put('/registration', authenticateToken, async (req, res) => {
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
