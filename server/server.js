// Imports
const fs = require('fs').promises;
const model = require("../public/model.js");
const DATABASE = require("./database/database.js");
require("../public/framework.js");

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
    clients : {},
    last_id : 0,

    // Init server
    init: async function(){

        // Load world data
        const data = await fs.readFile("./public/rooms.json");
        WORLD.fromJSON(JSON.parse(data));
        
        // Notify success
        console.log(`World data successfully loadad! \nNumber of rooms ${WORLD.num_rooms}`);

        // MySQL Connection
        DATABASE.initConnection();
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
        // Database check
        const result = DATABASE.validateUsername(credentials.username);
        console.log(result);
     
        // Create new user and store it
        const user = WORLD.createUser(null);
        user.name = credentials.username;
        user.avatar = credentials.avatar;
        const room = WORLD.getRoom(WORLD.default_room);
        room.addUser(user);

        // Database push
        const result2 = DATABASE.pushUser(user, credentials.password);
        console.log(result2);
    },

    login: function(credentials)
    {
       const result = DATABASE.validateUser(credentials);
       console.log(result);
    }, 

    getUser: function(req, res)
    {
        // TODO
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
       
        // Store connection
        this.clients[user.id] = connection;       
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