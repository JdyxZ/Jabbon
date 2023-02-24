/***************** SERVER *****************/

// External module 
const http = require('http');
const url = require('url');
const express = require('express');
const morgan = require('morgan'); 
const WebSocketServer = require('websocket').server;
const path = require('path');
const session = require('express-session'); 
const passport = require('passport');
const MySQLSession = require('express-mysql-session')(session);
const ejs = require('ejs'); 
const flash = require('connect-flash');
const bodyParser = require('body-parser');

// Our modules
const SERVER = require("./server.js");
const CREDENTIALS = require("./database/credentials.js");
require('./utils/strategies.js');
require('./utils/serializer.js');

// Init server services
SERVER.init();

/***************** EXPRESS JS *****************/

// Create ExpressJS app
const app = express(); // We use ExpressJS to deal with requests, since it allows us to manage request in a simpler way and easily serve files to the client

// App settings
app.set('appName', 'Jabbon');
app.set('port', process.env.PORT || 9014);

// Define session properties
var session_properties = {
  secret: 'JabbonSession', // Session name
  resave: false, // avoids overwritting the current session with new info (first we have to drop the old session and then build a new one)
  saveUninitialized: false, // avoids saving an uninitialized session to the database (avoids server trash)
  cookie: { name: "JabbonCookie", _expires: new Date(Date.now() + (30 * 86400 * 1000)) } , // Set 1 month of expiration time
  store: new MySQLSession(CREDENTIALS) // Persistent session
};

// Define session parser
var sessionParser = session(session_properties);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
// app.use(morgan('short')); // To see the request specs
app.use(bodyParser.urlencoded({extended: false})); // Parses encoded data sent with post method through a form
app.use(bodyParser.json()); // Parses json data directly to objects
app.use(sessionParser); // Parses sessions
app.use(flash()); // Allows to easily store data in the session
app.use(passport.initialize());  // Processes signup and login requests
app.use(passport.session()); // Let passport know we are using a session context

// Global session variables
app.use((req, res, next) => {

  // Sign up variables
  app.locals.signup_username = req.flash('signup_username');
  app.locals.signup_username_error = req.flash('signup_username_error');
  app.locals.signup_password = req.flash('signup_password');
  app.locals.signup_password_error = req.flash('signup_password_error');
  app.locals.signup_error = req.flash('signup_error')

  // Log in variables
  app.locals.login_username = req.flash('login_username');
  app.locals.login_password = req.flash('login_password');
  app.locals.login_user_error = req.flash('login_user_error');
  app.locals.login_error = req.flash('login_error');

  // Pass to the next middleware
  next();
});

// Routers
app.use(require("./routes/authenticate"));
app.use(require("./routes/utils"));

// Default request folder
app.use(express.static(path.join(__dirname, '../public')));

/***************** HTTP SERVER *****************/

// Create HTTP server
const server = http.createServer(app); // Instead of passing a custom function to manage requests, we pass the express app and let it process the requests for us

// Launch the server
server.listen(app.get('port'), () => SERVER.onReady(app.get('port')));

// Update database on exit and periodically
require("./utils/update.js");

/***************** WEBSOCKET *****************/

// Create WebSocketServer
const wss = new WebSocketServer({ // create the server
    httpServer: server	 //if we already have our HTTPServer in server variable...
});

// Client connection request
wss.on('request', function(request) {

    // Parse session with sessionParser middleware
    sessionParser(request.httpRequest, {}, function(){

        // Get session info
        const session_info = request.httpRequest.session;

        // Validate session
        if(session_info.passport == undefined) 
        {
            // Reject connection
            request.reject(102, 'You must log in before trying to connect with WebSocket');
            return;
        } 
        else
        {
            // Get user id
            const user_id = session_info.passport.user;

            // Accept connection
            const connection = request.accept(null, request.origin);
    
            // Websocket callbacks
            SERVER.onUserConnected(connection, user_id);
            connection.on('message', (message) => SERVER.onMessage(connection, message));
            connection.on('close', (message) => SERVER.onUserDisconnected(connection));
        }      

      
    }); 
});

module.exports = app;