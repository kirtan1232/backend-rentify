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

// Update room by id
const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
