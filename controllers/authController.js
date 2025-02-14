const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const User = require('../models/User'); // Changed to CommonJ
const config = require('../config/config');

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, confirm_password,  role } = req.body;

    try {
        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword, // Store the hashed password
            role,
            confirm_password,
        });

        await user.save();
        res.status(200).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({success:false, message: 'Error registering user' });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Login successful', 
            token, 
            role: user.role, 
            name: user.name // ✅ Now sending the name of the user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in', error });
    }
};


const forgotPassword = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).send({ success: false, msg: "Email is required" });
    }

    try {
        const userData = await User.findOne({ email });

        if (!userData) {
            return res.status(404).send({ success: false, msg: "This email does not exist." });
        }

        const randomString = randomstring.generate();
        await User.updateOne({ email }, { $set: { token: randomString } });

        // Debugging email value
        console.log("Recipient Email:", userData.email);

        if (userData.email) {
            sendResetPasswordMail(userData.name, userData.email, randomString);
            return res.status(200).send({ success: true, msg: "Please check your inbox to reset your password." });
        } else {
            console.error("User email is missing.");
            return res.status(400).send({ success: false, msg: "Invalid email address." });
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error.message);
        return res.status(500).send({ success: false, msg: error.message });
    }
};


const sendResetPasswordMail = (name, email, token) => {
    console.log("Attempting to send email to:", email); // Debug log

    if (!email) {
        console.error("Recipient email is missing.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.emailUser,
            pass: config.emailPassword,
        },
    });

    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <p>Hi ${name},</p>
            <p>From Rentify </p>
            <p> Please click the link below to reset your password:</p>
            <p><a href="http://localhost:5173/reset-password?token=${token}">Reset Password</a></p>
           
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error.message); // Log error
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
};


const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ success: false, msg: "Token and new password are required." });
    }

    try {
        // Find user by token
        const userData = await User.findOne({ token });

        if (!userData) {
            return res.status(404).send({ success: false, msg: "Invalid or expired token." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the token
        await User.updateOne(
            { _id: userData._id },
            { $set: { password: hashedPassword, token: null } }
        );

        res.status(200).send({ success: true, msg: "Password reset successfully." });
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(500).send({ success: false, msg: error.message });
    }
};






module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    sendResetPasswordMail,
    resetPassword,
};
