const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    // passout Year
    year:{
        type: String,
        required: true
    },
    branch:{
        type: String,
        required: true
    },
    role : { type: String, 
        enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not supported'
      }},
    date:{
        type: Date,
        default: Date.now
    },
  });
  const User = mongoose.model("Auths", UserSchema);
  module.exports = User;