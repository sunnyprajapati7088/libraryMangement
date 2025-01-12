const express = require('express');
const dotenv=require('dotenv')
const app = express();
dotenv.config()
const mongoose = require('mongoose');
const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');
const userRoutes = require('./routes/users');
const borrowRecordRoutes = require('./routes/borrowRecords');
const { authenticateToken } = require('./middlewere/auth');



// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://kishan95570:kishan@cluster0.xvgle.mongodb.net/")
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use(authenticateToken)
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/users', userRoutes);
app.use('/borrow-records', borrowRecordRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

