const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true
  }
})

module.exports = model('Users', usersSchema);