// Global vars
var request_id = 0;
const server_port = 9014;

// Database
var mysql = require('mysql');
var client = mysql.createConnection({  database:'ecv-2019', user: 'ecv-user',  password: 'ecv-upf-2019',  host: '127.0.0.1'});

// Good practice to know my process pid
console.log("My pid is "+ process.pid);

// Module import
const http = require('http');
const url = require('url');
const WebSocketServer = require('websocket').server;
const express = require('express');

/***************** HTTP SERVER *****************/

// Create
const server = http.createServer(onHTTPRequest);

// Request
function onHTTPRequest(request, response)
{
    // Log the request in the terminal
    console.log(`REQUEST: ${request.url}`);

    // Get request params
	const url_info = url.parse( request.url, true ); //all the request info is here
	const pathname = url_info.pathname; //the address
	const params = url_info.query; //the parameters

    // Manage request
    switch(request.pathname)
    {
       case "/restartDB":
            // TODO: restart the DB
            response.end("OK");
        case "/login":
            // TODO: try to log in the user and give him a response
            response.end("OK");
        default:
            // Here should send an error and say something like "Sry, unknown url"
            response.end("Request successfully received!"); // Send response
    }
}

// Ready
server.listen(server_port, function() {
	console.log(`Server listening in port ${server_port}!`);
});

/***************** WEBSOCKET *****************/

// Create
const wss = new WebSocketServer({ // create the server
    httpServer: server	 //if we already have our HTTPServer in server variable...
});


wss.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    console.log("NEW WEBSOCKET USER!!!");
    connection.sendUTF("welcome!");

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        const obj = JSON.parse(message.utf8Data);
		console.log( "NEW MSG: " + Object.keys(obj) ); // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
	  console.log("USER IS GONE");// close user connection
    });

    client.query('USE prueba');
    client.query(
    'INSERT INTO usuario SET nombre = ?, password = ?',
    ['eric', 'miclave'] //important, avoids SQL-injects
    );
    
    client.query( 'SELECT * FROM usuario',
        function selectUsuario(err, results, fields) {
    
        if (err) {
            console.log("Error: " + err.message);
            throw err;
        }
    
        console.log("Number of rows: "+results.length);
        console.log(results);
    
        client.end();
    });
});

/***************** EXPRESS JS *****************/