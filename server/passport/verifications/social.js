/***************** SOCIAL VERIFICATION *****************/

// Our own modules
const {WORLD} = require("../../model/model.js");
const DATABASE = require("../../database/database.js");
const LOCKER = require("../../session/locker.js");


const SOCIAL_VERIFICATION = 
{
    process: async function(accessToken, refreshToken, profile, done)
    {
        console.log(profile);

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
                name : profile.displayName,
                social: social,
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

module.exports = SOCIAL_VERIFICATION;