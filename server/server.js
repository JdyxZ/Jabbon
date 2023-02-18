// External module imports
const path = require("path");

// Own module imports
const {User, Room, WORLD, Message} = require(path.join(__dirname, "../public/model/model.js"));
const DATABASE = require("./database/database.js");
require(path.join(__dirname, "../public/framework.js"));

/***************** SERVER *****************/
var SERVER = 
{
    // Server data
    port: null,
    clients : {},
    last_id : 0,
    world: null,

    // Init server
    init: async function(){

        // MySQL Connection
        DATABASE.initConnection();

        // Load world data
        const {type, model} = await DATABASE.fetchModel();
        if(type == "ERROR") console.log(model);
        else WORLD.init(model.rooms, model.users);

        // Assign world to the SERVER
        this.world = WORLD;
    },

    // Ready callback
    onReady: function(port)
    {
        console.log(`Server listening at port ${port}!`);
        this.port = port;
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

            // Check message
            const result = this.CheckMessage(message);
            if (result != "OK") return;
            
            // Route message
            this.routeMessage(message);
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
        // Notify the server
        console.log("User has joined");
       
        // Get vars
        const user = WORLD.getUser(0);
        const current_room = WORLD.getRoom(user.room);

        // Check that user exists
        if(user)
        {   
            // Store connection
            this.clients[user.id] = connection; 
            connection.user_id = user.id;

            // Send room data
            this.sendPrivateMessage(new Message("system", "ROOM", user.toJSON(), getTime()), connection.user_id);

            // Send myinfo data
            this.sendPrivateMessage(new Message("system", "YOUR_INFO", user.toJSON(), getTime()), connection.user_id);

            // Send room users data to my user
            current_room.people.forEach(people_id => {
                const connection = this.clients[people_id];
                this.sendPrivateMessage(new Message("system", "USER_JOIN", user.toJSON(), getTime()), connection.user_id);
            });

            // Send New user info
            this.sendRoomMessage( new Message("system", "USER_JOIN", user.toJSON(), getTime()), user.room, connection.user_id);
            
        };

    },

    onUserDisconnected: function(connection)
    {
        // Notify the server
        console.log("User has left");

        // Get necesary data of the leaving user
        const uid = connection.user_id;
        const user = WORLD.getUser(uid);

        // Delete the connection
        delete this.clients[uid];

        // Update info to the other users
        this.sendRoomMessage( new Message("system", "USER_LEFT", JSON.parse(user.name), getTime()), user.room, uid);
    },

    // Message callbacks
    routeMessage: function(message)
    {
        // Prepare the message to be broadcasted
        const addressees = message.addressees;
        if(message.addressees != undefined) delete message.addressees;
        if(message.date == null) message.date = getTime();
        
        // Eventually, message has passed all checkings and is ready to be sent!
        switch(message.type)
        {
            case "TICK":
                this.onTick(message);
                break;
            case "PRIVATE":
                this.onPrivateMessage(message);
                break;
            case "PUBLIC":
                this.onPublicMessage(message);
                break;
            case "EXIT":
                this.onExit(message);
                break;
            case "TYPING":
                this.onTyping(message);
                break;
        }

    },

    onTick: function()
    {
        // TODO
    },

    onPrivateMessage: function()
    {
        // TODO
    },

    onPublicMessage: function()
    {
        // TODO
    },

    onExit: function()
    {
        // TODO
    },

    onTyping: function()
    {
        // TODO
    },

    // Check message
    checkMessage: function()
    {
        // Get some vars
        const user_id = connection.user_id;
        const user_current_room = WORLD.rooms[WORLD.users[user_id].room];

        // Check the sender id and the connection user id matches
        if (message.sender != user_id)
        {
            const message = Message("system", "ERROR", "Eres muy perrito y me la has intentado colar", null);
            connection.sendUTF(JSON.stringify(message));
            return "SENDER_ERROR";
        };

        // Check the sender is sending messages to people of the same room
        if(message.addressees != [])
        {
            message.addressees.forEach(addressee => {
                if(!user_current_room.people.includes(addressee))
                {
                    const message = Message("system", "ERROR", "¿A quién le intentas enviar tú un mensaje, perrito?", null);
                    connection.sendUTF(JSON.stringify(message));
                    return "ADDRESSEE ERROR";
                }
            });
        };

        // TODO: If a sender is sending a private message, check that the addressee is within the fov of the sender.

        return "OK";
    },

    // Send message
    sendClientsMessage: function(message)
    {
        Object.values(this.clients).forEach(connection => {
            connection.sendUTF(JSON.stringify(message));
        });
    },

    sendRoomMessage: function(message, room_name, id_)
    {
        // Get room
        const room = WORLD.getRoom(room_name);

        // Iterate through room people
        for(id of room.people)
        {
            if(id == id_) continue;
            const connection = this.clients[id];
            connection.sendUTF(JSON.stringify(message));
        }
    },

    sendPrivateMessage: function(message, addressees)
    {
        if(!isNaN(addressees))
        {
            // Get connection
            const connection = this.clients[addressees];
            if(connection == undefined){
                console.log(`Connection with user id ${addressees} doesn't exist`);
                return;
            } 
    
            // Send message to the user
            connection.sendUTF(JSON.stringify(message));
        }
        else if (addressee instanceof Array)
        {
            // Iterate through addresses
            for(const addressee of addressees)
            {
                // Get connection
                const connection = this.clients[addressee];
                if(connection == undefined){
                    console.log(`Connection with user id ${addressees} doesn't exist`);
                    continue;
                } 
        
                // Send message to the user
                connection.sendUTF(JSON.stringify(message));
            }  
        }
    }
}

module.exports = SERVER;