// Data structures
var request_id = 0;


//Good practice to know my process pid
console.log("My pid is "+ process.pid);

var http = require('http');
var url = require('url');

var server = http.createServer( function(request, response) {
	console.log("REQUEST: " + request.url );
	var url_info = url.parse( request.url, true ); //all the request info is here
	var pathname = url_info.pathname; //the address
	var params = url_info.query; //the parameters

	response.end("ok, eric domain"); //send a response
});

server.listen(9014, function() {
	console.log("Server listening in port! " + 9014);
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({ // create the server
    httpServer: server	 //if we already have our HTTPServer in server variable...
});

// wsServer.on('request', function(request){
// 	console.log("NEW WEBSOCKET USER!!!");
// });

// wsServer.on('connection', ws => {
// 	console.log("NEW CLIENT CONNECTED");
// });


wsServer.on('request', function(request) {
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
});
