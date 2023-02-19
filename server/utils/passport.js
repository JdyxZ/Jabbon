// External modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Our modules
const DATABASE = require("../database/database.js");
const CRYPTO = require("./crypto.js");

// Define strategy
passport.use('signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, name, password, flush) => {
    
    const user_json =
    {
        name,
        password 
    }

    console.log(user_json);
}));

/*
passport.seralizeUser((user,done) =>{

})
*/

