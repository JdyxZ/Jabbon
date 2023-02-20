// External modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Our modules
const SERVER = require("../server.js");
const DATABASE = require("../database/database.js");
const CRYPTO = require("./crypto.js");

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
    const user = SERVER.world.createUser(user_obj);
    SERVER.world.addUsertoRoom(user.id, user.room);

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
    let [status, result] = await DATABASE.validateUsername(name, hashed_password);

    if (status == "ERROR")
    {
        console.log(result);
        return done(null, false, req.flash('login_error', 'Something wrong happened. Try again.'));
    }
        
    if (result[0].length == 0) return done(null, false, req.flash('login_user_error', 'Wrong user or password.'));

    // Check that the client is not already connected in another session
    const user_id = result[0][0].id;

    if(SERVER.clients.includes(user_id.toString()))
    {
        return done(null, false, req.flash('login_error', 'The user you are trying to log in is already logged in a different window'));
    }

    // Pass user id to the serializer
    return done(null, user_id);
}));

// Store user id into the express session
passport.serializeUser((user_id,done) => {
    done(null, user_id);
});

// Get user id from session
passport.deserializeUser(async (user_id, done) => {
    // Query
    const [status, result] = await DATABASE.validateUserID(user_id);

    // Check
    if(status == "ERROR") return done(result);
    if(result[0].length == 0) return done("ID not valid");

    // Flush user ID
    done(null, user_id);
});



