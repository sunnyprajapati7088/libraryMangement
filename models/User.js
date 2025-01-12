const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, },
  password:{type:String,required:true},
  role:{type:String,default:"user"},
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});


module.exports = mongoose.model('UserAuth', UserSchema);

