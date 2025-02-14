const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Admin-only route
router.get('/admin-dashboard', verifyToken, authorizeRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome to the Admin Dashboard' });
});

// User-only route
router.get('/user-dashboard', verifyToken, authorizeRole(['user']), (req, res) => {
    res.json({ message: 'Welcome to the User Dashboard' });
});

module.exports = router;
