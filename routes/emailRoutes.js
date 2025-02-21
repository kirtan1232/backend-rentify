// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');

router.post('/send', sendEmail);

module.exports = router;