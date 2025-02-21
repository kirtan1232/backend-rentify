// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateUser,getAllUsers,getUserById } = require('../controllers/userController');
const User = require('../models/User');

// Update user by ID
router.get('/customer/:id ', getUserById);
router.put('/update/:id',  updateUser);
router.get('/customer',  getAllUsers);
// Get user by ID
router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching user' });
    }
  });
router.delete('/delete/:id', async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error deleting user' });
    }
  });

module.exports = router;