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
async (req, name, password, flush) => {

    // Check username
    let [status, result] = await DATABASE.validateUsername(name);

    if (status == "ERROR") return flush(result);
    if (result[0].length != 0) return flush(`Username ${name} already exists`);

    // Check password
    const [check, error] = CRYPTO.check(password);
    if(check == "ERROR") return flush(error);

    // Hash password
    const hashed_password = await CRYPTO.encrypt(password);

    // Get other user properties from body
    //const {avatar} = req.body;

    // Push user info into the database
    let user_obj =
    {
        name : name,
        password: hashed_password,
        avatar : "./media/images/char1.png",
        room : 1,
        position: 0
    };

    [status, result] = await DATABASE.pushUser(user_obj);

    // Check push query result
    if(status == "ERROR") return flush(result);

    // Set push query user ID to object and delete password from it
    user_obj.id = result[0].insertId;
    delete user_obj.password;

    // Create new user into the WORLD
    const user = SERVER.world.createUser(user_obj);

    // Pass user id to the serializer
    return flush(null, user.id);
}));

// Define signup strategy
passport.use('login', new LocalStrategy(
{
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: false
}, 
async (name, password, flush) => {

    // Hash password
    const hashed_password = await CRYPTO.encrypt(password);  

    // Validate user
    let [status, result] = await DATABASE.validateUsername(name, hashed_password);

    if (status == "ERROR") return flush(result);
    if (result[0].length != 0) return flush(`User ${name} with password ${password} doesn't exists`);

    // Pass user id to the serializer
    return flush(null, user.id);
}));

// Store user id into the express session
passport.serializeUser((user_id,flush) => {
    flush(null, user_id);
});

// Get user id from session
passport.deserializeUser(async(user_id, flush) => {
    const [status, result] = await DATABASE.validateUserID(user_id);
    
    if(status == "ERROR") return flush(result);
    if(result[0].length == 0) return flush("ID not valid");

    flush(null, result[0].id);
});


