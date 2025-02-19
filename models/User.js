const mongoose = require('mongoose'); // Ensure this line is not repeated

const userSchema = new mongoose.Schema({
    image: {
        type: String,
        default: null,
      },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Allowed roles
        default: 'user', // Default to 'user'
    },
    token:{
        type:String,
        default: ''
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
