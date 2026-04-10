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

// Use environment variable for persistent storage path, fallback to local public directory
const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'public/uploads');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            const dir = path.join(UPLOAD_BASE_DIR, 'images');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } else if (file.mimetype.startsWith('video/')) {
            const dir = path.join(UPLOAD_BASE_DIR, 'videos');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } else if (file.mimetype === 'application/pdf') {
            const dir = path.join(UPLOAD_BASE_DIR, 'pdfs');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        } else {
            cb(new Error('Invalid file type'), null);
        }
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
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
app.use('/uploads', express.static(UPLOAD_BASE_DIR));
app.use(session({
    secret: 'ethiopia-tourism-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Create upload directories if they don't exist
const ensureDirectoriesExist = () => {
    const dirs = [
        UPLOAD_BASE_DIR,
        path.join(UPLOAD_BASE_DIR, 'images'),
        path.join(UPLOAD_BASE_DIR, 'videos'),
        path.join(UPLOAD_BASE_DIR, 'pdfs')
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
                    image_url: '/uploads/images/image-1774348095544-243391367.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        '/uploads/images/image-1774348095544-243391367.jpg',
                        '/uploads/images/additional_images-1774349835723-710576150.jpg',
                        '/uploads/images/additional_images-1774349891282-170302827.jpg',
                        '/uploads/images/additional_images-1774350056990-769444031.jpg',
                        '/uploads/images/additional_images-1774350133743-296989636.jpg',
                        '/uploads/images/additional_images-1774350328810-963274291.jpg'
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
                    image_url: '/uploads/images/image-1774349332567-819111054.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        '/uploads/images/image-1774349332567-819111054.jpg',
                        '/uploads/images/additional_images-1774350380775-959920199.jpg',
                        '/uploads/images/additional_images-1774350533360-213653322.jpg',
                        '/uploads/images/additional_images-1774350814813-654356778.jpg',
                        '/uploads/images/additional_images-1774350845299-527145360.jpg',
                        '/uploads/images/additional_images-1774351068542-722786279.jpg'
                    ]
                },
                {
                    name: 'Entoto Park',
                    description: 'Entoto Park is a beautiful natural park overlooking Addis Ababa, offering stunning views, walking trails, and cultural experiences.',
                    image_url: '/uploads/images/image-1774349550575-560101554.jpg',
                    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    gallery_images: [
                        '/uploads/images/image-1774349550575-560101554.jpg',
                        '/uploads/images/additional_images-1774351246861-532557193.jpg',
                        '/uploads/images/additional_images-1774351523994-346573917.jpg',
                        '/uploads/images/additional_images-1774352120265-787774579.jpg',
                        '/uploads/images/additional_images-1774352163903-271439695.jpg',
                        '/uploads/images/additional_images-1774352192362-281898948.jpg'
                    ]
                }
            ];

            await Place.insertMany(samplePlaces);
            console.log('Sample places created successfully');
        } else {
            console.log(`Found ${placesCount} existing places, skipping sample creation.`);
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
        
        // Try to find the place directly with the string ID (Mongoose handles this)
        const place = await Place.findById(req.params.id);
        console.log('Found place:', place ? place.name : 'null');
        console.log('Place description:', place ? place.description : 'null');
        console.log('Place data:', JSON.stringify(place, null, 2));
        
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

// Debug endpoint - check what images are stored in DB
app.get('/api/debug/images', async (req, res) => {
    try {
        const places = await Place.find({}, 'name image_url gallery_images');
        const debug = places.map(p => ({
            name: p.name,
            image_url: p.image_url,
            gallery_images: p.gallery_images,
            gallery_count: p.gallery_images ? p.gallery_images.length : 0
        }));
        res.json(debug);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// Cache for tourism context to avoid frequent DB lookups
let cachedTourismContext = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// AI Chat API endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, language = 'en-US', history = [], conversationHistory = [] } = req.body;
        const chatHistory = history.length > 0 ? history : conversationHistory;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get tourism data from database for context (with caching)
        if (!cachedTourismContext || Date.now() - lastCacheTime > CACHE_TTL) {
            const places = await Place.find({});
            let fullContext = places.map(place =>
                `${place.name}: ${place.description}`
            ).join('\n');

            // Truncate context to ~15000 characters to prevent token limit errors
            // even though gpt-4o-mini supports 128k, it's good practice to keep payloads small
            if (fullContext.length > 15000) {
                fullContext = fullContext.substring(0, 15000) + '... [Context truncated]';
            }
            cachedTourismContext = fullContext;
            lastCacheTime = Date.now();
        }

        const tourismContext = cachedTourismContext;

        // Create language-specific prompt
        let systemPrompt, userPrompt;

        if (language === 'am-ET') {
            // Amharic prompt
            const currentDateAm = new Date().toLocaleDateString('am-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            systemPrompt = `እርስዎ የኢትዮጵያ ቱሪዝም ብቃት ያለው እርዳታ ናቸው። ስለ ኢትዮጵያ የቱሪዝም መዳረሻዎች፣ ባህል እና የጉዞ ምክርተኛ በአማርኛ በተሟላ መረጃ ይስጡ። እባክዎ የዛሬው ቀን ${currentDateAm} መሆኑን ያስተውሉ።`;
            userPrompt = `እርስዎ የኢትዮጵያን ቱሪዝም የሚያውቁ ተረዳኢ ናቸው። እነዚህን የኢትዮጵያ ቱሪዝም ቦታዎች ያውቁ፦
${tourismContext}

እባክዎ የተጠየቁትን ጥያቄ ስለ ኢትዮጵያ ቱሪዝም በአማርኛ ይመልሱ። ብቃት ያለው፣ ትክክለኛነት ያለው እና ዝርዝር መረጃ ይስጡ።
በላይኛው ዝርዝር ውስጥ ያልተገኘውን ቦታ ከሆነ ጥያቄው፣ የኢትዮጵያን ቱሪዝም አጠቃላይ እውቀትዎን ይጠቀሙ።

የተጠየቀው ጥያቄ፦ ${message}`;
        } else {
            // English prompt
            const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            systemPrompt = `You are a knowledgeable tourism assistant for Ethiopia. Provide helpful, accurate information about Ethiopian tourist destinations, culture, and travel tips. For your awareness, today's date is ${currentDate}.`;
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
            if (chatHistory && chatHistory.length > 0) {
                conversationContext = '\n\nPrevious conversation:\n';
                chatHistory.forEach((msg, index) => {
                    conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
                });
                conversationContext += '\n';
            }

            const simplePrompt = language === 'am-ET' ?
`እርስዎ የኢትዮጵያ ቱሪዝም ብቃት ያለው የግለገጽ እርዳታ ናቸው። እንደ ቻትጂፒቲ በግልጽል፣ በግልጽል እና በጠቃሚ የተሞላ መልስ ይስጡ።

የኢትዮጵያ ቱሪዝም መረጃ፦
${tourismContext}${conversationContext}

የተጠየቀው ጥያቄ፦ "${message}"

መመሪያዎች፦
- ተጠቃሚው አጠቃላይ የውይይት ጥያቄ ከጠየቀ (ለምሳሌ "ሰላም"፣ "እንዴት ነህ"፣ "ዛሬ ስንት ቀን ነው")፣ በተለመደው እና በውይይት መልክ ይመልሱ።
- ይህንን በግልጽል እና በምርጫ ይዙሉት
- አጭር እና በግልጽል ይሁኑ
- የተማማኙን ጥያቄ በትክክል ያሟላት
- አስተማማኪ ጥያቄዎች ይጠይ቉` :
`You are an expert Ethiopia tourism assistant. Be helpful and engaging, but KEEP YOUR ANSWERS VERY SHORT AND CONCISE.

Ethiopia tourism context:
${tourismContext}${conversationContext}

User message: "${message}"

Guidelines:
- If the user asks a general or conversational question (like "hi", "how are you", "what day is it"), answer it normally and conversationally.
- If the user asks about Ethiopia tourism, use the context provided.
- Keep your answers VERY short and concise.
- Be conversational and friendly, not robotic.
- Ask follow-up questions when helpful.
- Reference previous conversation when relevant`;

            const token = process.env.OPENROUTER_API_KEY;
            if (!token) {
                console.error("OPENROUTER_API_KEY environment variable is not set.");
                throw new Error("API token is missing.");
            }
            const response = await axios.post(`https://openrouter.ai/api/v1/chat/completions`, {
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: simplePrompt }
                ],
                model: "openai/gpt-4o-mini",
                temperature: 0.7,
                max_tokens: 150
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'HTTP-Referer': 'https://ethiopia361.com',
                    'X-Title': 'Ethiopia 361 AI Chat'
                }
            });

            console.log('OpenRouter API response status:', response.status);
            const aiResponse = response.data.choices[0].message.content;
            res.json({ response: aiResponse });

        } catch (apiError) {
            console.error('OpenRouter API Error:', apiError.message);
            if (apiError.response && apiError.response.data) {
                console.error('OpenRouter API Error Details:', JSON.stringify(apiError.response.data, null, 2));
            }

            // Fallback response when API is not available
            const fallbackResponse = `I apologize, but I'm having trouble connecting to my AI service right now.

However, I can tell you about some amazing places in Ethiopia based on what I know:

${tourismContext}

For more detailed information about these places or other Ethiopia tourism questions, please try again later or contact our tourism office.

Would you like to know more about any specific place mentioned above?`;

            res.json({ response: fallbackResponse });
        }
    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({ error: 'Internal server error' });
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
app.post('/admin/add', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 20 }, { name: 'description_pdf', maxCount: 1 }]), async (req, res) => {
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
            console.log('Additional images received:', req.files.additional_images.length);
            req.files.additional_images.forEach((file, i) => {
                console.log(`  File ${i+1}: ${file.originalname} -> ${file.filename} (${file.size} bytes)`);
            });
            additionalImages = req.files.additional_images.map(file => '/uploads/images/' + file.filename);
            console.log('Additional image paths:', additionalImages);
        } else {
            console.log('No additional images in request. req.files keys:', req.files ? Object.keys(req.files) : 'no files');
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
                    'Relaxation & Resort Areas': '🌿',
                    'Religious': '⛪'
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
app.post('/admin/update/:id', isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'additional_images', maxCount: 20 }]), async (req, res) => {
    try {
        const id = req.params.id;
        const { 
            name, 
            description, 
            name_am, 
            description_am, 
            image_url, 
            video_url, 
            category,
            best_time,
            how_to_get_there,
            what_to_bring,
            accommodation,
            local_tips,
            deleted_images, 
            delete_video 
        } = req.body;
        
        console.log('Update request received for place ID:', id);
        console.log('Request body:', req.body);
        
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
            
            const existingGallery = Array.isArray(currentPlace.gallery_images) 
                ? currentPlace.gallery_images 
                : JSON.parse(currentPlace.gallery_images || '[]');
            
            existingGallery.forEach(img => {
                if (!deletedImagePaths.includes(img)) {
                    galleryImages.push(img);
                }
            });
        }
        
        // Add new additional images
        galleryImages.push(...additionalImages);
        
        // Create travel guide object
        const travelGuide = {
            best_time: best_time || (currentPlace.travel_guide ? currentPlace.travel_guide.best_time : ''),
            how_to_get_there: how_to_get_there || (currentPlace.travel_guide ? currentPlace.travel_guide.how_to_get_there : ''),
            what_to_bring: what_to_bring || (currentPlace.travel_guide ? currentPlace.travel_guide.what_to_bring : ''),
            accommodation: accommodation || (currentPlace.travel_guide ? currentPlace.travel_guide.accommodation : ''),
            local_tips: local_tips || (currentPlace.travel_guide ? currentPlace.travel_guide.local_tips : '')
        };
        
        // Update place
        await Place.findByIdAndUpdate(id, {
            name,
            description,
            name_am: name_am || '',
            description_am: description_am || '',
            category: category || currentPlace.category,
            category_icon: (() => {
                const icons = {
                    'Historical & Cultural Sites': '🏛️',
                    'Nature & Mountains': '🌄',
                    'Unique & Adventure Destinations': '🌋',
                    'Lakes & Water Attractions': '🌊',
                    'Cities & Urban Tourism': '🏙️',
                    'Relaxation & Resort Areas': '🌿',
                    'Religious': '⛪'
                };
                return icons[category || currentPlace.category] || '🏛️';
            })(),
            image_url: imagePath,
            video_url: videoPath,
            gallery_images: galleryImages,
            travel_guide: travelGuide
        });
        
        console.log('Place updated successfully:', name);
        res.redirect('/admin');
        
    } catch (error) {
        console.error('Update error details:', error);
        console.error('Error stack:', error.stack);
        res.status(500).send('Error updating place: ' + error.message);
    }
});

// Destinations Page
app.get('/destinations', async (req, res) => {
    try {
        const places = await Place.find({});
        res.render('destinations', { places });
    } catch (error) {
        console.error('Error fetching destinations:', error);
        res.render('destinations', { places: [] });
    }
});

// Contact Page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Guide Page
app.get('/guide', (req, res) => {
    res.render('guide');
});

// Gallery Page
app.get('/gallery', (req, res) => {
    res.render('gallery');
});

// Blog Page - Top 10 Places
app.get('/blog', async (req, res) => {
    try {
        const places = await Place.find({}).limit(10);
        res.render('blog', { places });
    } catch (error) {
        console.error('Blog page error:', error);
        res.render('blog', { places: [] });
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

// Dynamic Sitemap.xml for SEO
app.get('/sitemap.xml', async (req, res) => {
    try {
        const places = await Place.find({});
        const baseUrl = req.protocol + '://' + req.get('host');
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Static pages
        const staticPages = ['/', '/destinations', '/gallery', '/blog', '/guide', '/contact', '/categories'];
        staticPages.forEach(page => {
            xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });
        
        // Dynamic place pages
        places.forEach(place => {
            xml += `  <url>\n    <loc>${baseUrl}/place/${place._id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        });
        
        xml += '</urlset>';
        
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap error:', error);
        res.status(500).send('Error generating sitemap');
    }
});

// Custom 404 handler - must be after all other routes
app.use((req, res) => {
    res.status(404).render('404');
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
