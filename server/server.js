// Imports
const mysql = require('mysql');
const fs = require('fs').promises;
const model = require("../public/room.js");
const WORLD = model.WORLD;

/***************** SERVER *****************/
var SERVER = 
{
    // Server data
    port: null,
    DB: null,
    clients : [],
    last_id : 0,

    // Init server
    init: async function(){

        // Load world data
        const data = await fs.readFile("./public/rooms.json");
        WORLD.fromJSON(JSON.parse(data));
        
        // Notify success
        console.log(`World data successfully loadad! \nNumber of rooms ${WORLD.num_rooms}`);

        // SQL Database
        /*this.DB = mysql.createConnection(
            {  
                database:'ecv-2019',
                user: 'ecv-user',
                password: 'ecv-upf-2019',
                host: '127.0.0.1'
            }
        );*/
    },

    // Server callbacks
    onReady: function(port)
    {
        console.log(`Server listening at port ${port}!`);
        this.port = port;
    },

    onMessage: function(message)
    {
        console.log("New user message");

        // Process WebSocket message
        if (message.type === 'utf8') 
        {
            const obj = JSON.parse(message.utf8Data);
            console.log(`${obj}`); 
        }
    },

    onUserConnected: function(connection)
    {
        console.log("User has joined");

        // Push connection
        this.clients.push(connection);

        // Create new user and store it
        const user = new model.User("hola", null, null, null, null, null, null);
        const room = WORLD.getRoom(WORLD.default_room);
        room.addUser(user);

        // Insert new user
       /* client.query('USE prueba');
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
        }); */
    },

    onUserDisconnected: function(connection)
    {
        console.log("User has left");
        // delete socket;
    }
}

module.exports = SERVER;