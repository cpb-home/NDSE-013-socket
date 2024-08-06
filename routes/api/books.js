const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const router = express.Router();
const Books = require('../../models/books');

router.get('/', (req, res) => {
  res.render('index', {
    title: "Главная",
    user: req.user
  })
});

router.get('/book', async (req, res) => {
  try {
    const books = await Books.find().select('-__v');
    
    res.render('book/index', {
      title: "Библиотека",
      books: books,
      user: req.user
    })
  } catch (e) {
    console.log(`Ошибюка роута /: ${e}`);
    res.redirect('/404');
  }
});

router.get('/book/view/:id', async (req, res) => {
  try {
    const books = await Books.find().select('-__v');
    const { id } = req.params;
    const idx = books.findIndex(book => book.id === id);

    if (idx === -1) {
      res.redirect('/404');
    } else {console.log(req.user)
      res.render('book/view', {
        title: "Библиотека",
        book: books[idx],
        user: req.user
      })
    }
  } catch (e) {
    console.log(`Ошибюка роута /: ${e}`);
    res.redirect('/404');
  }
});

router.get('/book/create', (req, res) => {
  res.render('book/create', {
    title: "Библиотека",
    book: {},
    user: req.user
  })
});

router.post('/book/create', async (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;
  const newBooks = new Books({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  });

  try {
    await newBooks.save();

    res.redirect('/api/books/book');
  } catch (e) {
    console.log(`Ошибюка роута /: ${e}`);
    res.redirect('/404');
  }
});

router.get('/book/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Books.findById(id);

    res.render('book/update', {
      title: 'Библиотека',
      book: book,
      user: req.user
    })
  } catch (e) {
    console.log(`Ошибюка роута /: ${e}`);
    res.redirect('/404');
  }
})

router.post('/book/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;
  
  try {
    await Books.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName, fileBook});

    res.redirect('/api/books/book/');
  } catch (e) {
    console.log(`Ошибюка роута /: ${e}`);
    res.redirect('/404');
  }
})

router.post('/book/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Books.findByIdAndDelete(id);

    res.redirect('/api/books/book');
  } catch (e) {
    console.log(`Ошибюка роута /: ${e}`);
    res.redirect('/404');
  }
})

router.get('/contacts', (req, res) => {
  res.render('contacts/index', {
    title: 'Контакты',
    user: req.user
  })
})

module.exports = router;