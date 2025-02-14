const express = require("express");
const multer = require("multer");
const Room = require("../models/roomsModel"); // Room model
const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a room
router.post("/", upload.single("roomImage"), async (req, res) => {
  try {
    const roomData = {
      roomDescription: req.body.roomDescription,
      floor: req.body.floor,
      address: req.body.address,
      rentPrice: req.body.rentPrice,
      parking: req.body.parking,
      contactNo: req.body.contactNo,
      bathroom: req.body.bathroom,
      roomImage: req.file ? req.file.path : null, // Save the image path
    };

    const newRoom = new Room(roomData);
    await newRoom.save();

    res.status(201).json({ message: "Room added successfully" });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room" });
  }
});

module.exports = router;
