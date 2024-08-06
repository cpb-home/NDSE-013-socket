const express = require('express');
const router = express.Router();
const Users = require('../../models/users');
const passport = require('../../middleware/auth');
const LocalStrategy = require('passport-local').Strategy;

router.get('/login', (req, res) => {
  res.render('users/login', {
    title: "Авторизация",
    user: req.user
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
    title: "Регистрация",
    user: req.user
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