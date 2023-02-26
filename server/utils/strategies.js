/***************** CREDENTIALS VERIFICATION *****************/

// External modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Our modules
const {WORLD} = require("../model/model.js");
const DATABASE = require("../database/database.js");
const CRYPTO = require("./crypto.js");
const LOCKER = require("./locker.js");

// Define signup strategy
passport.use('signup', new LocalStrategy(
{
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, 
async (req, name, password, done) => {

    // Set input username and password to global variables through flash
    req.flash("signup_username", name);
    req.flash("signup_password", password);

    // Check username
    let [status, result] = await DATABASE.validateUsername(name);

    if (status == "ERROR")
    {
        console.log(result);
        return done(null, false, req.flash('signup_error', 'Something wrong happened. Try again.'));
    }
        
    if (result[0].length != 0) return done(null, false, req.flash('signup_username_error', `The username ${name} already exists.`));

    // Check password
    const [check, error] = CRYPTO.check(password);
    if (check == "ERROR") return done(null, false, req.flash('signup_password_error', error));

    // Hash password
    const hashed_password = await CRYPTO.encrypt(password);

    // Push user info into the database
    let user_obj =
    {
        name : name,
        password: hashed_password,
        avatar : "media/images/char1.png",
        room : 1,
        position: 0
    };

    [status, result] = await DATABASE.pushUser(user_obj);

    if (status == "ERROR")
    {
        console.log(result);
        return done(null, false, req.flash('signup_error', 'Something wrong happened. Try again'));
    }

    // Set push query user ID to object and delete password from it
    user_obj.id = result[0].insertId;
    delete user_obj.password;

    // Create new user into the WORLD and add it to its room
    const user = WORLD.createUser(user_obj);
    WORLD.addUsertoRoom(user.id, user.room);

    // If old session is active, delete it
    await LOCKER.deleteCurrentSession(req);

    // Pass user id to the serializer
    return done(null, user.id);
}));

// Define signup strategy
passport.use('login', new LocalStrategy(
{
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true
}, 
async (req, name, password, done) => {

    // Set input username and password to global variables through flash
    req.flash("login_username", name);
    req.flash("login_password", password);

    // Hash password
    const hashed_password = await CRYPTO.encrypt(password);  

    // Check user credentials
    let [status, result] = await DATABASE.validateUser({name: name, password: hashed_password});

    if (status == "ERROR")
    {
        console.log(result);
        return done(null, false, req.flash('login_error', 'Something wrong happened. Try again.'));
    }
        
    if (result[0].length == 0) return done(null, false, req.flash('login_user_error', 'Wrong user or password.'));

    // Check that the client is not already connected in another session
    const user_id = result[0][0].id;

    // Check if user is trying to log in the same account opened in a different window
    if(LOCKER.checkConnection(user_id))
        return done(null, false, req.flash('login_error', 'The user you are trying to log in is already logged in a different window'));

    // If old session is active, delete it
    LOCKER.deleteCurrentSession(req)
    .then(() =>
    {
        // Pass user id to the serializer
        return done(null, user_id);
    })
    .catch((err) =>
    {
        console.log(err);
        return done(null, false, req.flash('login_error', 'Something wrong happened. Try again.'));
    })
  
}));