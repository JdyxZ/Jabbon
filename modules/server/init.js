// Server data
const server_port = 9014;

// Good practice to know my process pid
console.log(`Serving with pid ${process.pid}`);

// External module imports
const http = require('http');
const url = require('url');
const WebSocketServer = require('websocket').server;
const express = require('express');

// Own module imports
const SERVER = require("server.js");
SERVER.init();

/***************** HTTP SERVER *****************/

// Create ExpressJS app
const app = express(); // We use ExpressJS to deal with requests, since it allows us to manage request in a simpler way and easily serve files to the client

// Create HTTP server
const server = http.createServer(app); // Instead of passing a custom function to manage requests as a callback, we pass the express app

/***************** EXPRESS JS *****************/

// To handle static files, redirect to public folder
//app.use(express.static('public'));
// TODO: create a public folder

// To handle request of type GET to path '/'
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Launch the server
app.listen(server_port, () => SERVER.onReady(server_port));

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
    connection.on('message', SERVER.onMessage(message));
    connection.on('close', SERVER.onUserDisconnected(connection));
});