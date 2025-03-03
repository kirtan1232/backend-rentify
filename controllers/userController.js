// controllers/authController.js
const asyncHandler = require("../middleware/async");
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Add this to your authController.js
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching user',
            error: error.message 
        });
    }
};

const getAllUsers = async (req, res) => {
    // Get all users excluding passwords
    const users = await User.find({}).select('-password');
    
    res.status(200).json({ 
        success: true, 
        users 
    });
};


const updateUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userId = req.params.id;
  
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
  
        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
  
        // // If a new password is provided, hash it and update
        // if (password) {
        //     const hashedPassword = await bcrypt.hash(password, 10);
        //     user.password = hashedPassword;
        // }
  
        // Save the updated user
        await user.save();
  
        res.status(200).json({ success: true, message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating user', error });
    }
  };
  
  
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = {
    getUserById,
    getAllUsers,
    updateUser,
    authenticateToken,
};