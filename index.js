const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
//const passport = require('passport');
const passport = require('./middleware/auth')
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/users');

const PORT = process.env.SERVER_PORT || 3000;
const DB_PORT = process.env.DB_PORT || 'mongodb://root:example@mongo:27017/';
const mainUrl = process.env.MAIN_URL || '/api';

const error404 = require('./middleware/404');
const booksRouter = require('./routes/api/books');
const usersRouter = require('./routes/api/users');
/*
const verify = (username, password, done) => {
  Users.findOne({ username : username}).then(user => {console.log(user); return done(null, user)}).catch(e => {console.log (e); return done(e); });
  */
  /*
  Users.findOne({}, { username : username}, (err,user) => {
    return err 
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' })
        : done(null, false, { message: 'Incorrect username.' });
  });
  */
/*
  Users.find({ username: username, password: password }, (err, user) => {
      if (err) {console.log(1); return done(err)}
      if (!user) { console.log(2); return done(null, false) }
      console.log(3); 
      return done(null, user)
  })*/
/*}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser( (id, cb) => {
  Users.findById(id,  (err, user) => {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

*/

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'SECRET'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(mainUrl + '/books', booksRouter);
app.use(mainUrl + '/user', usersRouter);
app.use(error404);

async function start(PORT, DB_PORT) {
  try {
    await mongoose.connect(DB_PORT);
    app.listen(PORT, () => {
      console.log(`Library started at port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start(PORT, DB_PORT);