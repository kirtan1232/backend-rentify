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
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
    },
    floor: {
      type: String,
      required: [true, 'Floor number is required'],
    },
    status: {
      type: String,
      required: [true, 'Room status is required'],
    },
    rentPrice: {
      type: Number,
      required: [true, 'Rent price is required'],
    },
    parking: {
      type: Boolean,
      required: [true, 'Parking availability is required'],
    },
    sellContactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    bathroom: {
      type: Number,
      required: [true, 'Bathroom count is required'],
    },
    postedOn: {
      type: Date,
      required: [true, 'Posted on date is required'],
    },
    expiredOn: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
