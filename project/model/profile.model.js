const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  profileImageUrl: {
    type: String,
    default: null
  },
  coinsBalance: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  
});

const User = mongoose.model('Profile', profileSchema);

module.exports = User;
