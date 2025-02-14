const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, sendResetPasswordMail} = require('../controllers/authController');
const {reset} = require("nodemon");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.post('/sendResetMailPassword', sendResetPasswordMail);
router.post('/reset-password', resetPassword);



module.exports = router;
