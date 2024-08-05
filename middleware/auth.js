const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/users');

const verify = (username, password, done) => {
  Users.findOne({ username : username, password: password}).then(user => done(null, user)).catch(e => done(e));
}

const options = {
  usernameField: "username",
  passwordField: "password",
}

passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser( (id, cb) => {
  Users.findById(id).then(user => cb(null, user)).catch(e => cb(e))
})

module.exports = passport;