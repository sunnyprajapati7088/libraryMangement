const mongoose = require('mongoose');

const BorrowRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date, default: Date.now },
  returnDate: { type: Date }
});

module.exports = mongoose.model('BorrowRecord', BorrowRecordSchema);

