// models/roomModel.js
const mongoose = require('mongoose');

// Define the schema for a room
const roomSchema = new mongoose.Schema({
  roomDescription: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  rentPrice: {
    type: Number,
    required: true,
  },
  parking: {
    type: String,
    enum: ['available', 'not available'],
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  bathroom: {
    type: Number,
    required: true,
  },
  roomImage: {
    type: String,  // Store image URL or path
    required: false,
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
