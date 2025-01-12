const express = require('express');
const BorrowRecord = require('../models/BorrowRecord');
const { authRole } = require('../middlewere/auth');

const router = express.Router();

// GET /borrow-records: Fetch all borrow records with user and book details
router.get('/',authRole('admin'), async (req, res) => {
  console.log("borr")
  try {
    const borrowRecords = await BorrowRecord.find()
      .populate('user', 'name email')
      .populate('book', 'title');
    res.json(borrowRecords);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching borrow records', error });
  }
});

router.get('/user',authRole('user'), async (req, res) => {
  console.log("kjkjkj")
  try {
    const borrowRecords = await BorrowRecord.findOne({})
      .populate('user', 'name email')
      .populate('book', 'title');
    res.json(borrowRecords);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching borrow records', error });
  }
});

module.exports = router;

