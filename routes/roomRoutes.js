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
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
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

    res.status(201).json({ message: "Room added successfully", room: newRoom });
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

// GET route to fetch a single room by ID
router.get("/:id", async (req, res) => {
  try {
    const roomId = req.params.id; // Get the room ID from the URL parameter
    const room = await Room.findById(roomId); // Find the room by ID

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room); // Return the room as JSON
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

// PUT route to update a room by ID
router.put("/:id", upload.single("roomImage"), async (req, res) => {
  try {
    const roomId = req.params.id; // Get the room ID from the URL parameter
    const { roomDescription, floor, address, rentPrice, parking, contactNo, bathroom } = req.body;

    // Find the room by ID and update it
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        roomDescription,
        floor,
        address,
        rentPrice,
        parking,
        contactNo,
        bathroom,
        roomImage: req.file ? req.file.path : undefined, // Update the image if a new image is provided
      },
      { new: true } // This will return the updated room document
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// DELETE route to delete a room by ID
router.delete("/:id", async (req, res) => {
  try {
    const roomId = req.params.id; // Get the room ID from the URL parameter

    // Delete the room by ID
    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

module.exports = router;