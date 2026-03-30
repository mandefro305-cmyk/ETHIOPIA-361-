// MongoDB Setup for Ethiopia 361° Tourism Website
// Complete server.js replacement for MongoDB

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { User, Place } = require('./models/database');
require('dotenv').config();
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://mandea:Mandea@cluster0.2pqdkpd.mongodb.net/?appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB database.');
    initializeDatabase();
}).catch(err => {
    console.error('MongoDB connection error details:', err);
    console.error('Connection string used:', 'mongodb+srv://mandea:Mandea@cluster0.2pqdkpd.mongodb.net/?appName=Cluster0');
    process.exit(1); // Exit if can't connect to database
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'public/uploads/images/');
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, 'public/uploads/videos/');
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(session({
    secret: 'ethiopia-tourism-secret',
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');
}

// Database initialization function for MongoDB
async function initializeDatabase() {
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ username: 'admin' });
        
        if (!adminExists) {
            // Create default admin user
            const hashedPassword = '$2b$10$wTf7tPOnv81wZ0j4x9xT1ObM19PZ43177Q82q81kH2n178N29gZl.';
            const adminUser = new User({
                username: 'admin',
                password: hashedPassword
            });
            await adminUser.save();
            console.log('Admin user created');
        }

        // Check if sample places exist
        const placesCount = await Place.countDocuments();
        
        if (placesCount === 0) {
            // Insert sample places
            const samplePlaces = [
                {
                    name: 'Lalibela Rock-Hewn Churches',
                    description: 'Lalibela is famous for its rock-hewn churches carved into stone.',
                    image_url: 'lalibela.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: ['/img/lalibela.jpg','/img/lalibela2.jpg','/img/lalibela3.jpg','/img/lalibela4.jpg','/img/lalibela5.jpg','/img/lalibela6.jpg']
                },
                {
                    name: 'Simien Mountains National Park',
                    description: 'Beautiful national park with dramatic mountains.',
                    image_url: 'simien.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: ['/img/simien.jpg','/img/lalibela2.jpg','/img/lalibela3.jpg','/img/lalibela4.jpg','/img/lalibela5.jpg','/img/lalibela6.jpg']
                },
                {
                    name: 'Entoto Park',
                    description: 'A scenic park on the outskirts of Addis Ababa.',
                    image_url: 'entoto.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: ['/img/danakil.svg','/img/lalibela2.jpg','/img/lalibela3.jpg','/img/lalibela4.jpg','/img/lalibela5.jpg','/img/lalibela6.jpg']
                }
            ];

            await Place.insertMany(samplePlaces);
            console.log('Sample places created');
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

// Routes
app.get('/', async (req, res) => {
    try {
        const places = await Place.find({});
        res.render('index', { places });
    } catch (error) {
        console.error('Home page error:', error);
        res.render('index', { places: [] });
    }
});

app.get('/place/:id', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).send("Place not found");
        res.render('place', { place });
    } catch (error) {
        console.error('Place detail error:', error);
        res.status(500).send('Error loading place');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.render('login', { error: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.userId = user._id;
            res.redirect('/admin');
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'Login failed' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Admin Dashboard
app.get('/admin', isAuthenticated, async (req, res) => {
    try {
        const places = await Place.find({});
        res.render('admin', { places });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.render('admin', { places: [] });
    }
});

// Admin Add Place
app.post('/admin/add', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 5 }]), async (req, res) => {
    const { name, description, image_url, video_url } = req.body;
    
    try {
        // Determine image path
        let imagePath = image_url;
        if (req.files && req.files.image && req.files.image[0]) {
            imagePath = '/uploads/images/' + req.files.image[0].filename;
        }
        
        // Determine video path
        let videoPath = video_url;
        if (req.files && req.files.video && req.files.video[0]) {
            videoPath = '/uploads/videos/' + req.files.video[0].filename;
        }
        
        // Handle additional images for gallery
        let additionalImages = [];
        if (req.files && req.files.additional_images) {
            additionalImages = req.files.additional_images.map(file => '/uploads/images/' + file.filename);
        }
        
        // Create gallery images array (main image + additional images)
        let galleryImages = [];
        if (imagePath) {
            galleryImages.push(imagePath);
        }
        galleryImages = galleryImages.concat(additionalImages);
        
        // Create new place
        const newPlace = new Place({
            name,
            description,
            image_url: imagePath,
            video_url: videoPath,
            gallery_images: galleryImages
        });
        
        await newPlace.save();
        res.redirect('/admin');
    } catch (error) {
        console.error('Add place error:', error);
        res.status(500).send('Error adding place');
    }
});

// Admin Edit Place Form
app.get('/admin/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) return res.status(404).send("Place not found");
        res.render('edit', { place });
    } catch (error) {
        console.error('Edit form error:', error);
        res.status(500).send('Error loading place');
    }
});

// Admin Update Place
app.post('/admin/update/:id', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 5 }]), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, image_url, video_url, deleted_images, delete_video } = req.body;
        
        // Get current place
        const currentPlace = await Place.findById(id);
        if (!currentPlace) return res.status(404).send("Place not found");
        
        // Determine image path
        let imagePath = image_url;
        if (req.files && req.files.image && req.files.image[0]) {
            imagePath = '/uploads/images/' + req.files.image[0].filename;
        } else if (!image_url && currentPlace.image_url) {
            imagePath = currentPlace.image_url;
        }
        
        // Determine video path
        let videoPath = video_url;
        if (req.files && req.files.video && req.files.video[0]) {
            videoPath = '/uploads/videos/' + req.files.video[0].filename;
        } else if (!video_url && currentPlace.video_url && delete_video !== 'true') {
            videoPath = currentPlace.video_url;
        } else if (delete_video === 'true') {
            videoPath = null;
        }
        
        // Handle additional images
        let additionalImages = [];
        if (req.files && req.files.additional_images) {
            additionalImages = req.files.additional_images.map(file => '/uploads/images/' + file.filename);
        }
        
        // Create gallery images array
        let galleryImages = [];
        
        // Add main image if not deleted
        if (imagePath) {
            galleryImages.push(imagePath);
        }
        
        // Add existing gallery images (excluding deleted ones)
        if (currentPlace.gallery_images) {
            let deletedImagePaths = [];
            if (deleted_images) {
                try {
                    deletedImagePaths = JSON.parse(deleted_images);
                } catch (e) {
                    console.log('Error parsing deleted images:', e);
                }
            }
            
            currentPlace.gallery_images.forEach(img => {
                if (img !== currentPlace.image_url && 
                    !deletedImagePaths.includes(img) && 
                    !galleryImages.includes(img)) {
                    galleryImages.push(img);
                }
            });
        }
        
        // Add new additional images
        galleryImages = galleryImages.concat(additionalImages);
        
        // Update place
        await Place.findByIdAndUpdate(id, {
            name,
            description,
            image_url: imagePath,
            video_url: videoPath,
            gallery_images: galleryImages
        });
        
        res.redirect('/admin');
    } catch (error) {
        console.error('Update place error:', error);
        res.status(500).send('Error updating place');
    }
});

// Admin Delete Place
app.post('/admin/delete/:id', isAuthenticated, async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error('Delete place error:', error);
        res.status(500).send('Error deleting place');
    }
});

// Other routes (keep existing ones)
app.get('/destinations', (req, res) => res.render('destinations'));
app.get('/culture', (req, res) => res.render('culture'));
app.get('/guide', (req, res) => res.render('guide'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/blog', (req, res) => res.render('blog'));
app.get('/contact', (req, res) => res.render('contact'));

// Start server
const PORT = process.env.PORT || 3000;
if (process.env.VERCEL === '1') {
    // Export for Vercel serverless
    module.exports = app;
} else {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}
