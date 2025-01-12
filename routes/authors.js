const express = require('express');
const Author = require('../models/Author');
const { authRole } = require('../middlewere/auth');

const router = express.Router();

// GET /authors: List all authors with the books they have written
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching authors', error });
  }
});


// POST /authors: Add a new author
router.post('/',authRole('admin'), async (req, res) => {
  try {
    const { name, dateOfBirth, nationality } = req.body;
    const author = new Author({ name, dateOfBirth, nationality });
    await author.save();
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ message: 'Error creating author', error });
  }
});

// GET /authors/:id: Fetch an author's details and the books they have written
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate('books');
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching author', error });
  }
});

module.exports = router;

