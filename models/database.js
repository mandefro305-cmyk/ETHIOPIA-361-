const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Place Schema with Gallery Images
const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        default: ''
    },
    video_url: {
        type: String,
        default: ''
    },
    gallery_images: {
        type: [String],
        default: []
    }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Place = mongoose.model('Place', placeSchema);

module.exports = { User, Place };
