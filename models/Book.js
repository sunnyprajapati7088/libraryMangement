const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  genres: [{ type: String }],
  publicationYear: { type: Number, required: true }
});


module.exports = mongoose.model('Book', BookSchema);

