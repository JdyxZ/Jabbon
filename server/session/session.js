/***************** DATABASE SESSION *****************/

// External modules
const SESSION = require('express-session'); 
const MySQLSession = require('express-mysql-session')(SESSION);

// Our modules
const {JABBON_CREDENTIALS} = require('../config/database_credentials.js');
require("../../public/framework.js");

// Define schema properties
const SESSION_SCHEMA =
{
    schema : 
    {		
        tableName: 'jabbon_sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

// Define session properties
const SESSION_PROPERTIES = 
{
    key: 'JabbonSession', // Session name
    secret: 'keyboard_cat', // Session secret
    resave: false, // avoids overwritting the current session with new info (first we have to drop the old session and then build a new one)
    saveUninitialized: false, // avoids saving an uninitialized session to the database (avoids server trash)
    cookie: 
    { 
        name: "JabbonCookie", 
        _expires: new Date(Date.now() + (30 * 86400 * 1000)) // Set 1 month of expiration time
    },
    store: new MySQLSession(JABBON_CREDENTIALS.concat(SESSION_SCHEMA)) // Persistent session
};  

module.exports = {SESSION_SCHEMA, SESSION_PROPERTIES, SESSION};