// Good practice to know my process pid
console.log(`Serving with pid ${process.pid}`);

// External module imports
const http = require('http');
const url = require('url');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const WebSocketServer = require('websocket').server;

// Own module imports
const SERVER = require("./server.js");
SERVER.init();

/***************** HTTP SERVER *****************/

// Create ExpressJS app
const app = express(); // We use ExpressJS to deal with requests, since it allows us to manage request in a simpler way and easily serve files to the client

// Create HTTP server
const server = http.createServer(app); // Instead of passing a custom function to manage requests as a callback, we pass the express app

/***************** EXPRESS JS *****************/

// Settings
app.set('port', process.env.PORT || 9014);

// Middleware
app.use(morgan('short')); // To see request content
app.use(express.json()); // To parse json content
app.use(cors());
app.use(express.urlencoded({extended: false})); // User send data
app.use(express.static('public')); // To handle static files, redirect to public folder

// Routes
app.get('/user', SERVER.getUser);

app.post('/sigin', function(req, res){ // User signin
  SERVER.signin(req.body);
  res.end("Sigin request received");
});

app.post('/login', function(req, res){ // User login
  SERVER.login(req.body);
  res.end("Login request received");
});

app.put('/user', function(req, res){ // User update
  SERVER.updateUser(req.body);
  res.end("User update request received");
});

app.delete('/user', function(req, res){ // User delete
  SERVER.deleteUser(req.body);
  res.end("User delete request received");
});

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