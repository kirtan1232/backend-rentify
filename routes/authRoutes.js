// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, sendResetPasswordMail, uploadImage } = require('../controllers/authController');
const upload = require("../middleware/multer");

// Route for uploading an image
router.post("/uploadImage", upload, uploadImage);

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for forgot password
router.post('/forgotPassword', forgotPassword);

// Route for sending reset password mail
router.post('/sendResetMailPassword', sendResetPasswordMail);

// Route for resetting password
router.post('/reset-password', resetPassword);

module.exports = router;