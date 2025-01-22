const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    roomImage: {
      type: String,
      required: [true, 'Room image is required'],
    },
    roomDescription: {
      type: String,
      required: [true, 'Room description is required'],
    },
    floor: {
      type: String,
      required: [true, 'Floor number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
   
    rentPrice: {
      type: Number,
      required: [true, 'Rent price is required'],
    },
    parking: {
      type: Boolean,
      required: [true, 'Parking availability is required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    bathroom: {
      type: Number,
      required: [true, 'Bathroom count is required'],
    },
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);