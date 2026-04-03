const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'shree_classes_super_secret_key'; // Hardcoded for mockup

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // In-memory user lookup
    const user = global.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.post('/register', (req, res) => {
    const { email, password, role } = req.body;
    if (global.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = {
        id: global.users.length + 1,
        email,
        password, // In real app, bcrypt hash this
        role: role || 'student'
    };
    global.users.push(newUser);
    res.status(201).json({ message: 'User created' });
});

module.exports = router;
