const express = require('express');
const router = express.Router();
const Users = require('../../models/users');
const passport = require('../../middleware/auth');
const LocalStrategy = require('passport-local').Strategy;

router.get('/login', (req, res) => {
  res.render('users/login', {
    title: "Авторизация"
  })
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/api/user/login' }),
  (req, res) => {
    res.redirect('/api/user/me')
  }
);

router.get('/signup', (req, res) => {
  res.render('users/signup', {
    title: "Регистрация"
  })
});

router.post('/signup', (req, res) => {
  const { username, password, displayName, mail } = req.body;
  if (username !== '' && password !== '' && displayName !== '' && mail !== '') {
    Users.create({username, password, displayName, mail}).then(res.redirect('/api/user/login'))
  } else {
    res.redirect('/api/user/signup')
  }
  
});

router.get('/me', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/api/user/login')
  }
  next()
  },
  (req, res) => {
    res.render('users/me', { title: 'Личный кабинет', user: req.user })
  }
)

router.get('/logout',  (req, res) => {
  req.logout(null, () => {
    
  });
  res.redirect('/api/user/login');
})

module.exports = router;


/*
const express = require('express');
const router = express.Router();
const Books = require('../../models/books');

router.get('/login', (req, res) => {
  res.render('users/login', {
    title: "Авторизация",
    book: {}
  })
});

router.post('/login', async (req, res) => {
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
*/