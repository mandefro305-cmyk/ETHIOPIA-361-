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
mongoose.connect('mongodb+srv://mandea:Mandea@cluster0.2pqdkpd.mongodb.net/?appName=Cluster0').then(() => {
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
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'ethiopia-tourism-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/login');
}

// Database initialization function for MongoDB
async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        // Check if admin user exists
        const adminExists = await User.findOne({ username: 'admin' });
        console.log('Admin user exists:', !!adminExists);
        
        // Always delete and recreate admin user to ensure correct password
        if (adminExists) {
            console.log('Deleting existing admin user...');
            await User.deleteOne({ username: 'admin' });
        }
        
        console.log('Creating admin user...');
        // Create default admin user with correct bcrypt hash for "admin"
        const hashedPassword = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // bcrypt hash for "admin"
        const adminUser = new User({
            username: 'admin',
            password: hashedPassword
        });
        await adminUser.save();
        console.log('Admin user created successfully');

        // Check if sample places exist
        const placesCount = await Place.countDocuments();
        console.log('Current places count:', placesCount);
        
        if (placesCount === 0) {
            console.log('Creating sample places...');
            // Insert sample places
            const samplePlaces = [
                {
                    name: 'Lalibela Rock-Hewn Churches',
                    description: 'Lalibela is famous for its rock-hewn churches carved into stone during the 12th century. These magnificent churches are considered one of the wonders of the world.',
                    image_url: '/uploads/images/lalibela.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        '/uploads/images/lalibela1.jpg',
                        '/uploads/images/lalibela2.jpg',
                        '/uploads/images/lalibela3.jpg',
                        '/uploads/images/lalibela4.jpg',
                        '/uploads/images/lalibela5.jpg',
                        '/uploads/images/lalibela6.jpg'
                    ]
                },
                {
                    name: 'Simien Mountains National Park',
                    description: 'The Simien Mountains offer breathtaking views, unique wildlife, and challenging trekking opportunities. Home to the Gelada baboon and Walia ibex.',
                    image_url: '/uploads/images/simien.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        '/uploads/images/simien1.jpg',
                        '/uploads/images/simien2.jpg',
                        '/uploads/images/simien3.jpg',
                        '/uploads/images/simien4.jpg',
                        '/uploads/images/simien5.jpg',
                        '/uploads/images/simien6.jpg'
                    ]
                },
                {
                    name: 'Entoto Park',
                    description: 'Entoto Park is a beautiful natural park overlooking Addis Ababa, offering stunning views, walking trails, and cultural experiences.',
                    image_url: '/uploads/images/entoto.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        '/uploads/images/entoto1.jpg',
                        '/uploads/images/entoto2.jpg',
                        '/uploads/images/entoto3.jpg',
                        '/uploads/images/entoto4.jpg',
                        '/uploads/images/entoto5.jpg',
                        '/uploads/images/entoto6.jpg'
                    ]
                }
            ];

            await Place.insertMany(samplePlaces);
            console.log('Sample places created successfully');
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        console.error('Error details:', error.message);
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
    try {
        console.log('Login attempt - req.body:', req.body);
        console.log('Login attempt - raw body:', JSON.stringify(req.body));
        
        // Check if body exists
        if (!req.body) {
            console.error('Login error: req.body is undefined');
            return res.render('login', { error: 'Form submission error' });
        }
        
        const { username, password } = req.body;
        
        // Check if username and password exist
        if (!username || !password) {
            console.error('Login error: Missing username or password');
            console.error('Username:', username, 'Password:', password ? 'provided' : 'missing');
            return res.render('login', { error: 'Please fill all fields' });
        }
        
        console.log('Looking for user:', username);
        const user = await User.findOne({ username: username });
        if (!user) {
            console.error('User not found:', username);
            return res.render('login', { error: 'Invalid username or password' });
        }
        
        console.log('User found, checking password');
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log('Login successful for user:', username);
            req.session.userId = user._id;
            res.redirect('/admin');
        } else {
            console.error('Password mismatch for user:', username);
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        console.error('Error stack:', error.stack);
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
        console.log('Admin dashboard accessed by user:', req.session.userId);
        const places = await Place.find({});
        console.log('Found places:', places.length);
        res.render('admin', { places });
    } catch (error) {
        console.error('Admin dashboard error details:', error);
        console.error('Error stack:', error.stack);
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
