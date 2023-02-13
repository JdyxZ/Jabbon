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
    clients : {},
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

    // Ready callback
    onReady: function(port)
    {
        console.log(`Server listening at port ${port}!`);
        this.port = port;
    },

    // ExpressJS callbacks
    signin: function(credentials)
    {
        console.log(credentials);
    },

    login: function(credentials)
    {
        console.log(credentials);
    },

    getUser: function(req, res)
    {
        res.json({
            username: "Pedro",
            password: 1234
          })
    },

    updateUser: function(credentials)
    {
        console.log(credentials);
    },

    removeUser: function(credentials)
    {
        console.log(credentials);
    },

    // WebSocket callbacks

    onMessage: function(connection, message)
    {
        // Check
        if (message.type != 'utf8') 
            return;

        // Process WebSocket message
        try {
            const obj = JSON.parse(message.utf8Data);
        } 
        catch (error) {
            if (error instanceof SyntaxError)
                connection.sendUTF("ERROR: The message you have sent is not a JSON Object, try again");
            else
                connection.sendUTF(`ERROR: ${error}`);
        }
    },

    onUserConnected: function(connection)
    {
        console.log("User has joined");

        // Create new user and store it
        const user = new model.User("hola", null, null, null, null, null, null);
        const room = WORLD.getRoom(WORLD.default_room);
        room.addUser(user);

        // Store connection
        this.clients[user.name] = connection;

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
    },

    // Methods
    onTick: function()
    {
        Object.keys(this.clients).forEach(name => {
            const user = WORLD.getUser(name);
        })
    },

    sendMessage(addressee, type, content, sender, time)
    {
        const connection = this.clients[addressee];
    }
}

module.exports = SERVER;