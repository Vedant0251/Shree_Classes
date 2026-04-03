const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory mock database (since no DB was specified)
global.users = [
    { id: 1, email: 'admin@shree.com', password: 'password', role: 'admin' },
    { id: 2, email: 'teacher@shree.com', password: 'password', role: 'teacher' },
    { id: 3, email: 'student@shree.com', password: 'password', role: 'student' }
];

app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
