/***************** DATABASE CONFIG *****************/

// Imports
const SESSION = require('express-session'); 
const MySQLSession = require('express-mysql-session')(SESSION);

// Define database credentials
const CREDENTIALS = 
{
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "Jabbon",
    password: process.env.DB_PASSWORD || "Cacahuete200$",
    database: process.env.DB_DATABASE || "JabbonDB",
    port: process.env.DB_PORT || 3306,
    debug: false
}

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
    store: new MySQLSession(CREDENTIALS.concat(SESSION_SCHEMA)) // Persistent session
};  

module.exports = {CREDENTIALS, SESSION_SCHEMA, SESSION_PROPERTIES, SESSION};