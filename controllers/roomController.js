const multer = require("multer");
const fs = require("fs");
const Room = require("../models/");


// Create a new room
const createRoom = async (req, res) => {
    try {
      const { roomDescription, floor, address, rentPrice, parking, contactNo, bathroom } = req.body;
      const roomImage = req.file ? req.file.path : ""; // Assuming you're using multer for file upload
  
      const newRoom = new Room({
        roomDescription,
        floor,
        address,
        rentPrice,
        parking,
        contactNo,
        bathroom,
        roomImage,
      });
  
      await newRoom.save();
      res.status(201).json({ message: "Room added successfully", success: true, room: newRoom });
    } catch (error) {
      res.status(500).json({ message: "Error adding room", success: false, error: error.message });
    }
  };
  
  // Get all rooms
  const getAllRooms = async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms", success: false, error: error.message });
    }
  };
  

// Get a single room by id
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room", error: error.message });
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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

// Update room by id
const updateRoom = async (req, res) => {
  try {
    // First handle the image upload
    const roomImage = req.file ? req.file.path : undefined;  // Get the new image path, if uploaded

    // Now, update the room data including the image
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,  // This will include the other fields like roomDescription, rentPrice, etc.
        roomImage: roomImage,  // Update the image if it's provided
      },
      { new: true }  // This ensures the updated room is returned
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error: error.message });
  }
};

// Delete room by id
const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error: error.message });
  }
};

module.exports = { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom };
