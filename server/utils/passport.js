// External modules
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

// Our modules
const DATABASE = require("../database/database.js");

// Define strategy
passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqtoCallback: true
}, async (req, username, password, done) =>{
    console.log(req.body);
}));

/*
passport.seralizeUser((user,done) =>{

})
*/

