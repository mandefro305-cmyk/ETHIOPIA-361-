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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ethiopia-tourism', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB database.');
    initializeDatabase();
}).catch(err => console.error('MongoDB connection error:', err));

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secret-key-for-tourism-app',
    resave: false,
    saveUninitialized: true
}));

// Auth Middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

// ----------------------------------------------------
// API Routes
// ----------------------------------------------------

app.get('/api/places', (req, res) => {
    db.all("SELECT * FROM places ORDER BY name", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// ----------------------------------------------------
// Frontend Routes
// ----------------------------------------------------

app.get('/', (req, res) => {
    db.all("SELECT * FROM places", [], (err, rows) => {
        if (err) throw err;
        res.render('index', { places: rows });
    });
});

app.get('/place/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM places WHERE id = ?", [id], (err, row) => {
        if (err) throw err;
        if (!row) return res.status(404).send("Place not found");
        res.render('place', { place: row });
    });
});

// Serve other static HTML-converted-to-EJS pages directly for now
app.get('/destinations', (req, res) => res.render('destinations'));
app.get('/culture', (req, res) => res.render('culture'));
app.get('/guide', (req, res) => res.render('guide'));
app.get('/gallery', (req, res) => res.render('gallery'));
app.get('/blog', (req, res) => res.render('blog'));
app.get('/contact', (req, res) => res.render('contact'));

// ----------------------------------------------------
// Admin & Auth Routes
// ----------------------------------------------------

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
app.post('/admin/update/:id', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 5 }]), (req, res) => {
    const id = req.params.id;
    const { name, description, image_url, video_url, deleted_images, delete_video } = req.body;
    
    // Get current place data to preserve existing files if no new files uploaded
    db.get("SELECT * FROM places WHERE id = ?", [id], (err, currentPlace) => {
        if (err) throw err;
        if (!currentPlace) return res.status(404).send("Place not found");
        
        // Determine image path
        let imagePath = image_url;
        if (req.files && req.files.image && req.files.image[0]) {
            imagePath = '/uploads/images/' + req.files.image[0].filename;
        } else if (!image_url && currentPlace.image_url) {
            imagePath = currentPlace.image_url; // Keep existing if no new file and no new URL
        }
        
        // Determine video path
        let videoPath = video_url;
        if (req.files && req.files.video && req.files.video[0]) {
            videoPath = '/uploads/videos/' + req.files.video[0].filename;
        } else if (!video_url && currentPlace.video_url && delete_video !== 'true') {
            videoPath = currentPlace.video_url; // Keep existing if no new file and no new URL and not deleting
        } else if (delete_video === 'true') {
            videoPath = null; // Remove video if delete flag is set
            
            // Delete the actual video file from server
            if (currentPlace.video_url && currentPlace.video_url.startsWith('/uploads/')) {
                const fs = require('fs');
                const videoFilePath = currentPlace.video_url.replace('/uploads/videos/', './uploads/videos/');
                
                fs.unlink(videoFilePath, (err) => {
                    if (err) {
                        console.log('Error deleting video file:', err);
                    } else {
                        console.log('Video file deleted successfully:', videoFilePath);
                    }
                });
            }
        }
        
        // Handle additional images for gallery
        let additionalImages = [];
        if (req.files && req.files.additional_images) {
            additionalImages = req.files.additional_images.map(file => '/uploads/images/' + file.filename);
        }
        
        // Create gallery images JSON (preserve existing + remove deleted + add new)
        let galleryImages = [];
        
        // Parse deleted images
        let deletedImagePaths = [];
        if (deleted_images) {
            try {
                deletedImagePaths = JSON.parse(deleted_images);
            } catch (e) {
                console.log('Error parsing deleted images:', e);
            }
        }
        
        // Start with main image (if not deleted)
        if (imagePath && !deletedImagePaths.includes(imagePath)) {
            galleryImages.push(imagePath);
        }
        
        // Add existing gallery images (excluding deleted ones and old main image to avoid duplication)
        if (currentPlace.gallery_images) {
            try {
                const existingGallery = JSON.parse(currentPlace.gallery_images);
                // Add existing images that aren't deleted and aren't the main image
                existingGallery.forEach(img => {
                    if (img !== currentPlace.image_url && 
                        !deletedImagePaths.includes(img) && 
                        !galleryImages.includes(img)) {
                        galleryImages.push(img);
                    }
                });
            } catch (e) {
                console.log('Error parsing existing gallery images:', e);
            }
        }
        
        // Add new additional images
        galleryImages = galleryImages.concat(additionalImages);
        
        // Limit to 6 images total
        if (galleryImages.length > 6) {
            galleryImages = galleryImages.slice(0, 6);
        }
        
        // Store gallery as JSON string
        const galleryJson = JSON.stringify(galleryImages);
        
        db.run("UPDATE places SET name = ?, description = ?, image_url = ?, video_url = ?, gallery_images = ? WHERE id = ?",
            [name, description, imagePath, videoPath, galleryJson, id], function (err) {
                if (err) throw err;
                res.redirect('/admin');
            });
    });
});

// Admin Delete Place
app.post('/admin/delete/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM places WHERE id = ?", [id], function (err) {
        if (err) throw err;
        res.redirect('/admin');
    });
});

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, language = 'en-US', history = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get tourism data from database for context
        db.all("SELECT * FROM places", [], async (err, places) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Create context about Ethiopia tourism places
            const tourismContext = places.map(place => 
                `${place.name}: ${place.description}`
            ).join('\n');

            // Create language-specific prompt
            let systemPrompt, userPrompt;
            
            if (language === 'am-ET') {
                // Amharic prompt
                systemPrompt = 'እርስዎ የኢትዮጵያ ቱሪዝም ብቃት ያለው እርዳታ ናቸው። ስለ ኢትዮጵያ የቱሪዝም መዳረሻዎች፣ ባህል እና የጉዞ ምክርተኛ በአማርኛ በተሟላ መረጃ ይስጡ።';
                userPrompt = `እርስዎ የኢትዮጵያን ቱሪዝም የሚያውቁ ተረዳኢ ናቸው። እነዚህን የኢትዮጵያ ቱሪዝም ቦታዎች ያውቁ፦
${tourismContext}

እባክዎ የተጠየቁትን ጥያቄ ስለ ኢትዮጵያ ቱሪዝም በአማርኛ ይመልሱ። ብቃት ያለው፣ ትክክለኛነት ያለው እና ዝርዝር መረጃ ይስጡ። 
በላይኛው ዝርዝር ውስጥ ያልተገኘውን ቦታ ከሆነ ጥያቄው፣ የኢትዮጵያን ቱሪዝም አጠቃላይ እውቀትዎን ይጠቀሙ።

የተጠየቀው ጥያቄ፦ ${message}`;
            } else {
                // English prompt
                systemPrompt = 'You are a knowledgeable tourism assistant for Ethiopia. Provide helpful, accurate information about Ethiopian tourist destinations, culture, and travel tips.';
                userPrompt = `You are a helpful AI assistant specializing in Ethiopia tourism. 
You have knowledge about the following Ethiopia tourist places:
${tourismContext}

Please answer the user's question about Ethiopia tourism. Be helpful, accurate, and provide detailed information. 
If the question is about places not in the list above, use your general knowledge about Ethiopia tourism.

User question: ${message}`;
            }

            // Using OpenRouter API
            try {
                console.log('OpenRouter API Key:', process.env.OPENROUTER_API_KEY ? 'Key exists' : 'Key missing');
                console.log('Language:', language);
                console.log('Message:', message);

                // Build conversation context
                let conversationContext = '';
                if (history && history.length > 0) {
                    conversationContext = '\n\nPrevious conversation:\n';
                    history.forEach((msg, index) => {
                        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
                    });
                    conversationContext += '\n';
                }

                const simplePrompt = language === 'am-ET' ? 
    `እርስዎ የኢትዮጵያ ቱሪዝም ብቃት ያለው የግለገጽ እርዳታ ናቸው። እንደ ቻትጂፒቲ በግልጽል፣ በግልጽል እና በጠቃሚ የተሞላ መልስ ይስጡ።

የኢትዮጵያ ቱሪዝም መረጃ፦
${tourismContext}${conversationContext}

የተጠየቀው ጥያቄ፦ "${message}"` :
    `You are an expert Ethiopia tourism assistant. Be helpful and engaging, but KEEP YOUR ANSWERS VERY SHORT AND CONCISE.

Ethiopia tourism context:
${tourismContext}${conversationContext}

User message: "${message}"`;

                const token = process.env.OPENROUTER_API_KEY;
                if (!token) {
                    console.error("OPENROUTER_API_KEY environment variable is not set.");
                    throw new Error("API token is missing.");
                }
                const response = await axios.post(`https://openrouter.ai/api/v1/chat/completions`, {
                    model: "openai/gpt-4o-mini",
                    messages: [
                        { role: "system", content: simplePrompt },
                        { role: "user", content: message }
                    ]
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                console.log('OpenRouter response status:', response.status);
                const aiResponse = response.data.choices[0].message.content;
                res.json({ response: aiResponse });

            } catch (apiError) {
                console.error('OpenRouter API Error:', apiError.message);
                
                // Fallback response when API is not available
                const fallbackResponse = `I apologize, but I'm having trouble connecting to my AI service right now. 

However, I can tell you about some amazing places in Ethiopia based on what I know:

${tourismContext}

For more detailed information about these places or other Ethiopia tourism questions, please try again later or contact our tourism office.`;

                res.json({ response: fallbackResponse });
            }
        });

    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

// Start server
const port = process.env.PORT || 3000;
if (process.env.VERCEL === '1') {
    // Export for Vercel serverless
    module.exports = app;
} else {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port ${port}`);
    });
}
