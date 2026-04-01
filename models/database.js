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

// Place Schema with Gallery Images and Amharic Translations
const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_am: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    description_am: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Historical & Cultural Sites',
            'Nature & Mountains',
            'Unique & Adventure Destinations',
            'Lakes & Water Attractions',
            'Cities & Urban Tourism',
            'Relaxation & Resort Areas'
        ],
        default: 'Historical & Cultural Sites'
    },
    category_icon: {
        type: String,
        default: '🏛️'
    },
    travel_guide: {
        best_time_to_visit: { type: String, default: '' },
        how_to_get_there: { type: String, default: '' },
        what_to_bring: { type: String, default: '' },
        local_tips: { type: String, default: '' },
        entrance_fees: { type: String, default: '' },
        opening_hours: { type: String, default: '' },
        accommodation: { type: String, default: '' },
        nearby_attractions: { type: String, default: '' }
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
