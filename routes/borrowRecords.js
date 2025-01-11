const express = require('express');
const BorrowRecord = require('../models/BorrowRecord');

const router = express.Router();

// GET /borrow-records: Fetch all borrow records with user and book details
router.get('/', async (req, res) => {
  try {
    const borrowRecords = await BorrowRecord.find()
      .populate('user', 'name email')
      .populate('book', 'title');
    res.json(borrowRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrow records', error });
  }
});

module.exports = router;

