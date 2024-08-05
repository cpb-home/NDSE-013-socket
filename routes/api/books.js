const express = require('express');
const router = express.Router();
const Books = require('../../models/books');

router.get('/', (req, res) => {
  res.render('index', {
    title: "Главная"
  })
});

router.get('/book', async (req, res) => {
  try {
    const books = await Books.find().select('-__v');
    
    res.render('book/index', {
      title: "Библиотека",
      books: books
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
    } else {
      res.render('book/view', {
        title: "Библиотека",
        book: books[idx]
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
    book: {}
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
      book: book
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
    title: 'Контакты'
  })
})

module.exports = router;