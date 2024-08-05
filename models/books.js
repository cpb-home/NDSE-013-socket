const { Schema, model } = require('mongoose');

const booksSchema = new Schema({
  title: {
    type: String,
    default: '',
    //required: true
  },
  description: {
    type: String,
    default: '',
    //required: true
  },
  authors: {
    type: String,
    default: ''
  },
  favorite: {
    type: String,
    default: ''
  },
  fileCover: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  fileBook: {
    type: String,
    default: ''
  }
})

module.exports = model('Books', booksSchema);