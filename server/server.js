// Imports
const mysql = require('mysql');
const fs = require('fs').promises;
const model = require("../public/model.js");

// Model vars
const User = model.User;
const Room = model.Room;
const WORLD = model.WORLD;
const Message = model.Message;

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
        /*
        // Temporary local DB
        this.DB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Cacahuete200$",
            database: "mydb"
          });

        this.DB.connect(function(err) {
            if (err) throw err;
            console.log("Connected! TO THE DB");
        });
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
        var self = this;
        this.DB.query("SELECT * FROM users", function (err, result, fields) {
        if (err) throw err;
        users = JSON.parse(JSON.stringify(result));

        for (i = 0; i < users.length ; i++)
        {
            console.log(users[i]['name']);
            if(users[i]['name'] == credentials['user'] && users[i]['password'] == credentials['password'])
            {
                console.log("User found, sing up incorrect");
            }
        }

        var insert_user = "INSERT INTO users SET userId = ?, name = ?, password = ?";
        
        self.DB.query(insert_user,['2',credentials['user'],credentials['password']], function(err) {
            if (err) throw err;
            console.log("Data inserted");
        });

        console.log("sing in done");

      });
    },

    login: function(credentials)
    {
        this.DB.query("SELECT * FROM users", function (err, result, fields) {
            if (err) throw err;
            users = JSON.parse(JSON.stringify(result));

            for (i = 0; i < users.length ; i++)
            {
                console.log(users[i]['name']);
                if(users[i]['name'] == credentials['user'] && users[i]['password'] == credentials['password'])
                {
                    console.log("User found, login correct");
                    return;
                }
            }
            console.log("Wrong credentials");
          });
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
    onMessage: function(connection, ws_message)
    {
        // Check
        if (message.type != 'utf8') 
            return;

        // Process WebSocket message
        try {
            // Parse message
            const message = JSON.parse(ws_message.utf8Data);

            // Get some vars
            const user_id = getKeyFromValue(this.clients, connection);
            const user_current_room = WORLD.rooms[WORLD.users[user_id].room];

            // Check the sender id and the connection user id matches
            if (message.sender != user_id)
            {
                const message = Message("system", "ERROR", "Eres muy perrito y me la has intentado colar", null);
                connection.sendUTF(JSON.stringify(message));
                return;
            };

            // Check the sender is sending messages to people of the same room
            if(message.addressees != [])
            {
                message.addressees.forEach(addressee => {
                    if(!user_current_room.people.includes(addressee))
                    {
                        const message = Message("system", "ERROR", "¿A quién le intentas enviar tú un mensaje, perrito?", null);
                        connection.sendUTF(JSON.stringify(message));
                        return;
                    }
                });
            };

            // TODO: If a sender is sending a private message, check that the addressee is within the fov of the sender.

            // Prepare the message to be broadcasted
            const addressees = message.addressees;
            if(message.addressees != undefined) delete message.addressees;
            if(message.date == null) message.date = getTime();
            
            // Eventually, message has passed all checkings and is ready to be sent!
            switch(message.addressees.length)
            {
                case 0:
                    this.sendRoomMessage(message);
                    break;
                default:            
                    this.sendPrivateMessage(message, addressees);
                    break;                    
            };       
        } 
        // Catch errors
        catch (error) 
        {
            const message = Message("system", "ERROR", error, null);
            connection.sendUTF(JSON.stringify(message));
        }
    },

    onUserConnected: function(connection)
    {
        console.log("User has joined");

        // Create new user and store it
        const user = WORLD.createUser(null);
        const room = WORLD.getRoom(WORLD.default_room);
        room.addUser(user);

        // Store connection
        this.clients[user.id] = connection;

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
        Object.values(this.clients).forEach(connection => {
            const x = 10;
            // TODO
        })
    },

    sendRoomMessage: function(message)
    {
         // Iterate through connections
         Object.values(this.clients).forEach(connection => {

            // Send message to the user
            connection.sendUTF(JSON.stringify(message));

            // Return
            return;
        });   
    },

    sendPrivateMessage: function(message, addressees)
    {
        // Iterate through addresses
        for(addressee of addressees)
        {
            // Get connection
            const connection = this.clients[addressee];
            if(connection == undefined) continue;
    
            // Send message to the user
            connection.sendUTF(JSON.stringify(message));
        }

    }
}

module.exports = SERVER;