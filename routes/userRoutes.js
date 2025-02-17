// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/authController');

// Update user by ID
router.put('/update/:id', updateUser);

module.exports = router;