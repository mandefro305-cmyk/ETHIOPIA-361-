const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Routes
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
        
        console.log('Login successful for user:', username);
        res.send('Login successful! Username: ' + username + ', Password: ' + (password ? 'provided' : 'missing'));
        
    } catch (error) {
        console.error('Login error:', error);
        console.error('Error stack:', error.stack);
        res.render('login', { error: 'Login failed' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log('Visit http://localhost:3001/login to test');
});
