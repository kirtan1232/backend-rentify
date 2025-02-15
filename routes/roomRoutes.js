const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Room = require("../models/roomsModel"); // Room model
const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the 'uploads/' directory exists
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a room
router.post("/", upload.single("roomImage"), async (req, res) => {
  try {
    // Validate incoming data
    const { roomDescription, floor, address, rentPrice, parking, contactNo, bathroom } = req.body;
    if (!roomDescription || !floor || !address || !rentPrice || !contactNo || !bathroom) {
      return res.status(400).json({ error: "All fields are required except roomImage" });
    }

    const roomData = {
      roomDescription,
      floor,
      address,
      rentPrice,
      parking,
      contactNo,
      bathroom,
      roomImage: req.file ? req.file.path : null, // Save the image path, if uploaded
    };

    const newRoom = new Room(roomData);
    await newRoom.save();

    res.status(201).json({ message: "Room added successfully" });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({ error: "Failed to add room" });
  }
});

// GET route to fetch all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find(); // Fetch all rooms from the database
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms); // Return rooms as JSON
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

module.exports = router;
