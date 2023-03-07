/***************** VERIFICATIONS *****************/

// Our own modules
const {WORLD} = require("../model/model.js");
const DATABASE = require("../database/database.js");
const CRYPTO = require("../utils/crypto.js");
const LOCKER = require("../utils/locker.js");

const LOCAL_VERIFICATION = 
{
    signup: async function(req, name, password, done)
    {
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
            social : {},
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

        // Pass user id to the serializer to store in the sessions table
        return done(null, user.id);
    },

    login: async function(req, name, password, done)
    {
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
           // Pass user id to the serializer to store in the sessions table
            return done(null, user_id);
        })
        .catch((err) =>
        {
            console.log(err);
            return done(null, false, req.flash('login_error', 'Something wrong happened. Try again.'));
        })
    }
}

const SOCIAL_VERIFICATION = 
{
    process: async function(accessToken, refreshToken, profile, done)
    {

        // Define the attributes we want to store from profile
        const social =
        {
            id: profile.id,
            provider: profile.provider
        }

        // Check user credentials
        let [status, result] = await DATABASE.validateUserSocialID(social);

        // Handle errors
        if (status == "ERROR")
        {
            console.log(result);
            return done(null, false, req.flash('social_error', 'Something wrong happened. Try again.'));
        }

        // Declare user id
        let user_id;
        
        // SignUp: If the user doesn't already exist create it
        if (result[0].length == 0) 
        {
            // Create user object        
            let user_obj =
            {
                social: social,
                name : profile.displayName,
                avatar : "media/images/char1.png",
                room : 1,
                position: 0
            };

            // Push user info into the database
            [status, result] = await DATABASE.pushUser(user_obj);

            // Handle errors
            if (status == "ERROR")
            {
                console.log(result);
                return done(null, false, req.flash('signup_error', 'Something wrong happened. Try again'));
            }

            // Set push query user ID to object and user id var
            user_obj.id = result[0].insertId;
            user_id = user_obj.id;

            // Create new user into the WORLD and add it to its room
            const user = WORLD.createUser(user_obj);
            WORLD.addUsertoRoom(user.id, user.room);
        }  

        // LogIn: Otherwise find user id
        else 
        {
            // Get user id
            user_id = result[0][0].id;

             // Check if user is trying to log in the same account opened in a different window
            if(LOCKER.checkConnection(user_id))
            return done(null, false, req.flash('social_error', 'The user you are trying to log in is already logged in a different window'));
        }      
       
        // If old session is active, delete it
        LOCKER.deleteCurrentSession(req)
        .then(() =>
        {
           // Pass user id to the serializer to store in the sessions table
            return done(null, user_id);
        })
        .catch((err) =>
        {
            console.log(err);
            return done(null, false, req.flash('social_error', 'Something wrong happened. Try again.'));
        })
    }
}

module.exports = {LOCAL_VERIFICATION, SOCIAL_VERIFICATION};