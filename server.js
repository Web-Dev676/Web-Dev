const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: MONGO_URI,
        autoRemove: 'interval',
        autoRemoveInterval: 10
    }),
    cookie: { 
        maxAge: null,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const checkAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        if (req.xhr || req.path.startsWith('/api/')) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        return res.redirect('/login.html');
    }
    next();
};

// Root route handler - must be before static middleware
app.get('/', (req, res) => {
    if (!req.session || !req.session.userId) {
        res.redirect('/login.html');
    } else {
        res.redirect('/index.html');
    }
});

// Protected routes - must be before static middleware
app.get('/index.html', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Auth API routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        
        req.session.userId = user._id;
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});