const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    usage: { type: String, required: true},
    username: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    refreshToken: { type: String}
    
  }, { collection : 'Users' });
   
  const User = mongoose.model('User', userSchema);
   
  module.exports = User;