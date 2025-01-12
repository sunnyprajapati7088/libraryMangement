const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const router = express.Router();
const dotenv=require('dotenv')
dotenv.config()

// GET /users: List all users and their borrowed books
let sessions = new Set();
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('borrowedBooks', 'title');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// POST /users: Add a new user
router.post('/', async (req, res) => {  
  
  try {
    const { name, email,password,role } = req.body;
    const hashPassword= await bcrypt.hash(password,await bcrypt.genSalt());
    console.log(hashPassword)
    const user = new User({ name, email,password:hashPassword,role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});


// PUT /users/:id/borrow: Borrow a book
router.put('/:id/borrow', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const book = await Book.findById(req.body.bookId);

    if (!user || !book) {
      return res.status(404).json({ message: 'User or Book not found' });
    }

    if (user.borrowedBooks.includes(book._id)) {
      return res.status(400).json({ message: 'Book already borrowed by this user' });
    }

    user.borrowedBooks.push(book._id);
    await user.save();

    const borrowRecord = new BorrowRecord({ user: user._id, book: book._id });
    await borrowRecord.save();

    res.json({ message: 'Book borrowed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error borrowing book', error });
  }
});

// PUT /users/:id/return: Return a borrowed book
router.put('/:id/return', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const book = await Book.findById(req.body.bookId);

    if (!user || !book) {
      return res.status(404).json({ message: 'User or Book not found' });
    }

    if (!user.borrowedBooks.includes(book._id)) {
      return res.status(400).json({ message: 'Book not borrowed by this user' });
    }

    user.borrowedBooks = user.borrowedBooks.filter(id => !id.equals(book._id));
    await user.save();

    const borrowRecord = await BorrowRecord.findOne({ user: user._id, book: book._id, returnDate: null });
    if (borrowRecord) {
      borrowRecord.returnDate = new Date();
      await borrowRecord.save();
    }

    res.json({ message: 'Book returned successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error });
  }
});

module.exports = router;

