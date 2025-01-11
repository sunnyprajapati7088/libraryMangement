const express = require('express');
const Book = require('../models/Book');
const Author = require('../models/Author');

const router = express.Router();

// GET /books: List all books with their authors
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('authors', 'name');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});

// POST /books: Add a new book with its authors
router.post('/', async (req, res) => {
  console.log(req.body)
  try {
    const { title, price, authors, genres, publicationYear } = req.body;
    const book = new Book({ title, price, genres, publicationYear });

 
      const author = await Author.findById(authors);
     
      if (author) {
        book.authors.push(author._id);
        author.books.push(book._id);
        await author.save();
      }
    

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error creating book', error });
  }
});

// GET /books/:id: Fetch detailed information about a book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authors');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error });
  }
});

module.exports = router;

