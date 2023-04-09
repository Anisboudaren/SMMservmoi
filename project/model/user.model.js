const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profileId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  } , 
  role : {
    type : String , 
    enum : ['user' , 'admin'] , 
    default : 'user'
  } , 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Compare password with hashed password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
