// Good practice to know my process pid
console.log(`Serving with pid ${process.pid}`);

// External module imports
const http = require('http');
const url = require('url');
const express = require('express');
const morgan = require('morgan'); // ?
const cors = require('cors');
const WebSocketServer = require('websocket').server;
const path = require('path');
const session = require('express-session'); // ?
const validator = require('express-validator'); // ?
const passport = require('passport'); // ?
const mysqlsession = require('express-mysql-session')(session); // ?
const bodyParser = require('body-parser');
const ejs = require('ejs'); // ?

// Own module imports
const SERVER = require("./server.js");

// Init server services
SERVER.init();

/***************** HTTP SERVER *****************/

// Create ExpressJS app
const app = express(); // We use ExpressJS to deal with requests, since it allows us to manage request in a simpler way and easily serve files to the client

// Create HTTP server
const server = http.createServer(app); // Instead of passing a custom function to manage requests as a callback, we pass the express app

/***************** EXPRESS JS *****************/

// Settings
app.set('appName', 'Jabbon');
app.set('port', process.env.PORT || 9014);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('short')); // To see request content
app.use(express.json()); // To parse json content
app.use(cors());
app.use(express.urlencoded({extended: false})); // User send data
app.use(bodyParser.json());// Parse the data directly

// Global variables
app.use((req, res, next) =>{

  next();
});

// Routers
app.use(require("./routes/routes"));

// Public
console.log(path.join(__dirname, '../public'));
app.use(express.static(path.join(__dirname, '../public')));

// Launch the server
server.listen(app.get('port'), () => SERVER.onReady(app.get('port')));

/***************** WEBSOCKET *****************/

// Create
const wss = new WebSocketServer({ // create the server
    httpServer: server	 //if we already have our HTTPServer in server variable...
});

// Client connection
wss.on('request', function(request) {
      
    // Accept request and establish connection
    const connection = request.accept(null, request.origin);

    // Websocket callbacks
    SERVER.onUserConnected(connection);
    connection.on('message', (message) => SERVER.onMessage(connection, message));
    connection.on('close', SERVER.onUserDisconnected);
});