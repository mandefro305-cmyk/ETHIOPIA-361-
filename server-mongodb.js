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
            const dir = path.join(__dirname, 'public/uploads/images');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } else if (file.mimetype.startsWith('video/')) {
            const dir = path.join(__dirname, 'public/uploads/videos');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } else if (file.mimetype === 'application/pdf') {
            const dir = path.join(__dirname, 'public/uploads/pdfs');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(session({
    secret: 'ethiopia-tourism-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Create upload directories if they don't exist
const ensureDirectoriesExist = () => {
    const dirs = [
        path.join(__dirname, 'public/uploads'),
        path.join(__dirname, 'public/uploads/images'),
        path.join(__dirname, 'public/uploads/videos'),
        path.join(__dirname, 'public/uploads/pdfs')
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log('Created directory:', dir);
        }
    });
};

// Call this function at startup
ensureDirectoriesExist();

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
        // Create default admin user with plain text password (temporary fix)
        const adminUser = new User({
            username: 'admin',
            password: 'admin' // Plain text for now
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
                    category: 'Historical & Cultural Sites',
                    category_icon: '🏛️',
                    travel_guide: {
                        best_time_to_visit: 'October to March (dry season)',
                        how_to_get_there: 'Fly to Lalibela Airport or drive 700km from Addis Ababa',
                        what_to_bring: 'Comfortable shoes, camera, sun protection',
                        local_tips: 'Hire local guide for detailed history',
                        entrance_fees: '1000 ETB for foreigners',
                        opening_hours: '8:00 AM - 6:00 PM daily',
                        accommodation: 'Various hotels and guesthouses available',
                        nearby_attractions: 'Yemrehana Kristos Church, Asheton Maryam Monastery'
                    },
                    image_url: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela+1',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela+2',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela+3',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela+4',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela+5',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Lalibela+6'
                    ]
                },
                {
                    name: 'Simien Mountains National Park',
                    description: 'The Simien Mountains offer breathtaking views, unique wildlife, and challenging trekking opportunities. Home to the Gelada baboon and Walia ibex.',
                    category: 'Nature & Mountains',
                    category_icon: '🌄',
                    travel_guide: {
                        best_time_to_visit: 'September to November, March to May',
                        how_to_get_there: 'Drive 100km from Gondar or fly to Gondar then drive',
                        what_to_bring: 'Warm clothing, hiking boots, camping gear',
                        local_tips: 'Book permits in advance, hire scout mandatory',
                        entrance_fees: '300 ETB per day + 150 ETB scout fee',
                        opening_hours: '6:00 AM - 6:00 PM',
                        accommodation: 'Camping sites and lodge available',
                        nearby_attractions: 'Chenek Camp, Imet Gogo, Sankaber Camp'
                    },
                    image_url: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+Mountains',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+1',
                        'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+2',
                        'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+3',
                        'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+4',
                        'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+5',
                        'https://via.placeholder.com/400x300/007bff/ffffff?text=Simien+6'
                    ]
                },
                {
                    name: 'Entoto Park',
                    description: 'Entoto Park is a beautiful natural park overlooking Addis Ababa, offering stunning views, walking trails, and cultural experiences.',
                    image_url: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+Park',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+1',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+2',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+3',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+4',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+5',
                        'https://via.placeholder.com/400x300/28a745/ffffff?text=Entoto+6'
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
        console.log('Place details requested for ID:', req.params.id);
        
        // Validate ObjectId format
        const { ObjectId } = require('mongodb');
        let objectId;
        
        try {
            objectId = new ObjectId(req.params.id);
        } catch (idError) {
            console.log('Invalid ObjectId format:', req.params.id);
            return res.status(400).render('error', { 
                message: 'Invalid Place ID',
                error: 'The place ID format is invalid.'
            });
        }
        
        const place = await Place.findById(objectId);
        console.log('Found place:', place ? place.name : 'null');
        
        if (!place) {
            console.log('Place not found with ID:', req.params.id);
            return res.status(404).render('error', { 
                message: 'Place not found',
                error: 'The requested place could not be found in our database.'
            });
        }
        
        console.log('Rendering place details for:', place.name);
        res.render('place', { place });
    } catch (error) {
        console.error('Place detail error:', error);
        res.status(500).render('error', { 
            message: 'Error loading place',
            error: error.message
        });
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
        // Temporary plain text comparison
        const isMatch = (password === user.password);
        if (isMatch) {
            console.log('Login successful for user:', username);
            req.session.userId = user._id;
            res.redirect('/admin');
        } else {
            console.error('Password mismatch for user:', username);
            console.error('Expected:', user.password, 'Got:', password);
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

// Email sending endpoint
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Create nodemailer transporter
        const nodemailer = require('nodemailer');
        
        // Configure transporter (using Gmail for example)
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: 'kademandefro@gmail.com',
                pass: 'your-app-password' // Use app-specific password for Gmail
            }
        });
        
        // Email options
        const mailOptions = {
            from: email,
            to: 'kademandefro@gmail.com',
            subject: `Ethiopia 361° Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #004d40, #00695c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 2rem;">Ethiopia 361°</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">New Contact Form Submission</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #004d40; margin-bottom: 20px;">Contact Details</h2>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #333;">Name:</strong>
                            <p style="margin: 5px 0; color: #666;">${name}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #333;">Email:</strong>
                            <p style="margin: 5px 0; color: #666;">${email}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #333;">Subject:</strong>
                            <p style="margin: 5px 0; color: #666;">${subject}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <strong style="color: #333;">Message:</strong>
                            <p style="margin: 5px 0; color: #666; line-height: 1.6;">${message}</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 0.9rem;">
                            <p>This message was sent from the Ethiopia 361° website contact form.</p>
                            <p>Sent on: ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            `
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Email sent successfully' });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// API Routes
app.get('/api/places', async (req, res) => {
    try {
        const places = await Place.find({});
        res.json(places);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

app.get('/api/places/by-category', async (req, res) => {
    try {
        const places = await Place.find({});
        const categorizedPlaces = {};
        
        places.forEach(place => {
            if (!categorizedPlaces[place.category]) {
                categorizedPlaces[place.category] = [];
            }
            categorizedPlaces[place.category].push(place);
        });
        
        res.json(categorizedPlaces);
    } catch (error) {
        console.error('Error fetching places by category:', error);
        res.status(500).json({ error: 'Error fetching places' });
    }
});

app.get('/api/places/:id/travel-guide', async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);
        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }
        res.json(place);
    } catch (error) {
        console.error('Error fetching travel guide:', error);
        res.status(500).json({ error: 'Error fetching travel guide' });
    }
});

// AI Chat API endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;
        console.log('AI chat request:', message);
        
        // Simple AI response for Ethiopia tourism
        let response = '';
        
        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
            response = "Hello! Welcome to Ethiopia 361°! I'm your AI assistant for Ethiopian tourism. How can I help you explore Ethiopia today?";
        } else if (message.toLowerCase().includes('lalibela')) {
            response = "Lalibela is famous for its rock-hewn churches from the 12th century. It's a UNESCO World Heritage site and one of Ethiopia's most amazing destinations! Would you like to know more about visiting Lalibela?";
        } else if (message.toLowerCase().includes('addis') || message.toLowerCase().includes('addis ababa')) {
            response = "Addis Ababa is Ethiopia's vibrant capital city! It offers great museums, restaurants, and the Mercato market. It's the perfect starting point for your Ethiopian adventure. What interests you most about Addis?";
        } else if (message.toLowerCase().includes('best time')) {
            response = "The best time to visit Ethiopia is generally from October to March during the dry season. However, different regions have optimal times. What specific destinations are you interested in?";
        } else if (message.toLowerCase().includes('food') || message.toLowerCase().includes('cuisine')) {
            response = "Ethiopian cuisine is amazing! Don't miss injera with doro wat (spicy chicken stew), kitfo (raw beef), and shiro. Ethiopian coffee ceremonies are also a must-try experience!";
        } else if (message.toLowerCase().includes('transport') || message.toLowerCase().includes('travel')) {
            response = "Ethiopia has domestic flights, buses, and private car options. Ethiopian Airlines connects major cities, while buses are great for budget travel. For remote areas, 4WD vehicles are recommended.";
        } else {
            response = "That's interesting! Ethiopia has so much to offer - from historical sites like Lalibela and Axum to natural wonders like the Simien Mountains and Danakil Depression. What specific aspect of Ethiopian tourism would you like to know about?";
        }
        
        res.json({ response });
    } catch (error) {
        console.error('AI chat error:', error);
        res.status(500).json({ error: 'AI service unavailable' });
    }
});

// Categories Page
app.get('/categories', (req, res) => {
    res.render('categories');
});

// Places Page with Category Filter
app.get('/places', async (req, res) => {
    try {
        const { category } = req.query;
        let places;
        
        if (category) {
            places = await Place.find({ category: category });
        } else {
            places = await Place.find({});
        }
        
        res.render('places', { places, selectedCategory: category });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.render('places', { places: [], selectedCategory: null });
    }
});

// Admin Add Place
app.post('/admin/add', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 5 }, { name: 'description_pdf', maxCount: 1 }]), async (req, res) => {
    try {
        console.log('Add place request received');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        
        const { 
            name, 
            description, 
            name_am,
            description_am,
            image_url, 
            video_url,
            category,
            best_time_to_visit,
            how_to_get_there,
            what_to_bring,
            local_tips,
            entrance_fees,
            opening_hours,
            accommodation,
            nearby_attractions
        } = req.body;
        
        console.log('Extracted fields - name:', name, 'category:', category);
        
        // Determine image path
        let imagePath = image_url;
        if (req.files && req.files.image && req.files.image[0]) {
            const uploadedFile = req.files.image[0];
            console.log('Image file uploaded:', uploadedFile);
            console.log('File path:', uploadedFile.path);
            console.log('File destination:', uploadedFile.destination);
            console.log('File filename:', uploadedFile.filename);
            
            imagePath = '/uploads/images/' + uploadedFile.filename;
            
            // Check if file actually exists
            const fullFilePath = path.join(uploadedFile.destination, uploadedFile.filename);
            const fileExists = fs.existsSync(fullFilePath);
            console.log('Full file path:', fullFilePath);
            console.log('File exists:', fileExists);
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
        
        // Handle PDF upload
        let pdfPath = '';
        if (req.files && req.files.description_pdf && req.files.description_pdf[0]) {
            pdfPath = '/uploads/pdfs/' + req.files.description_pdf[0].filename;
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
            name_am: name_am || '',
            description,
            description_am: description_am || '',
            category: category || 'Historical & Cultural Sites',
            category_icon: (() => {
                const icons = {
                    'Historical & Cultural Sites': '🏛️',
                    'Nature & Mountains': '🌄',
                    'Unique & Adventure Destinations': '🌋',
                    'Lakes & Water Attractions': '🌊',
                    'Cities & Urban Tourism': '🏙️',
                    'Relaxation & Resort Areas': '🌿'
                };
                return icons[category] || '🏛️';
            })(),
            travel_guide: {
                best_time_to_visit: best_time_to_visit || '',
                how_to_get_there: how_to_get_there || '',
                what_to_bring: what_to_bring || '',
                local_tips: local_tips || '',
                entrance_fees: entrance_fees || '',
                opening_hours: opening_hours || '',
                accommodation: accommodation || '',
                nearby_attractions: nearby_attractions || ''
            },
            image_url: imagePath,
            video_url: videoPath,
            gallery_images: galleryImages,
            description_pdf: pdfPath
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
        console.log('Edit request for place ID:', req.params.id);
        const place = await Place.findById(req.params.id);
        console.log('Found place:', place ? place.name : 'null');
        
        if (!place) {
            console.error('Place not found with ID:', req.params.id);
            return res.status(404).send("Place not found");
        }
        
        console.log('Rendering edit form for place:', place.name);
        res.render('edit', { place });
    } catch (error) {
        console.error('Edit form error details:', error);
        console.error('Error stack:', error.stack);
        res.status(500).send('Error loading place: ' + error.message);
    }
});

// Admin Update Place
app.post('/admin/update/:id', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 5 }]), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, name_am, description_am, image_url, video_url, deleted_images, delete_video } = req.body;
        
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
            name_am: name_am || '',
            description,
            description_am: description_am || '',
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
app.get('/', async (req, res) => {
    try {
        const places = await Place.find({});
        res.render('index', { places });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.render('index', { places: [] });
    }
});

app.get('/destinations', async (req, res) => {
    res.render('destinations');
});

app.get('/guide', async (req, res) => {
    res.render('guide');
});

app.get('/gallery', async (req, res) => {
    res.render('gallery');
});

app.get('/blog', async (req, res) => {
    res.render('blog');
});

app.get('/contact', async (req, res) => {
    res.render('contact');
});

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
