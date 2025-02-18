const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Adjust the path
const User = require('../models/User'); // Adjust the path to your User model

// Add to Wishlist
router.post('/wishlist/add/:roomId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(req.params.roomId)) {
      user.wishlist.push(req.params.roomId);
      await user.save();
    }
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Remove from Wishlist (Optional)
router.delete('/wishlist/remove/:roomId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id !== req.params.roomId);
    await user.save();
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;