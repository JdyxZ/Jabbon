// Module imports
const {User, Room, WORLD, Message} = require("../public/model/model.js");
const {getTime} = require("../public/framework.js");
const DATABASE = require("./database/database.js");
require("../public/framework.js");

/***************** SERVER *****************/
var SERVER = 
{
    // Server data
    port: null,
    clients : {},
    last_id : 0,
    world: null,
    temp: 1,

    // Init server
    init: async function(){

        // MySQL Connection
        DATABASE.initConnection();

        // Load world data
        const [status, model] = await DATABASE.fetchModel();
        if(status == "ERROR") console.log(model);
        else WORLD.init(model.rooms, model.users);

        // Assign world to the SERVER
        this.world = WORLD;
        //console.log(this.world.rooms);
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
        
        // Process WebSocket message
        try {

            // Parse message
            const message = JSON.parse(ws_message.utf8Data);
            
            // Check message
            const result = this.CheckMessage(connection, message);
            if (result != "OK") return;
            
            // Route message
            this.routeMessage(message);
        } 
        // Catch errors
        catch (error) 
        {
            const message = new Message("system", "ERROR", error, getTime());
            connection.sendUTF(JSON.stringify(message));
        }
    },

    onUserConnected: function(connection, user_id)
    {
        // Notify the server
        console.log("User has joined");
       
        // Get vars
        var user = this.world.getUser(user_id);
        const current_room = this.world.getRoom(user.room);

        // Check that user exists
        if(user)
        {   
            // Store connection
            this.clients[user.id] = connection; 
            connection.user_id = user.id;
            this.OnNewUserEnter( user, user.id, current_room);   
        };
        
    },

    OnNewUserEnter: function(user, user_id, current_room)
    {
        // Send room data
        this.sendPrivateMessage(new Message("system", "ROOM", current_room.toJSON(), getTime()), user_id);
        //console.log(current_room.toJSON());  

        // Send myinfo data
        this.sendPrivateMessage(new Message("system", "YOUR_INFO", user.toJSON(), getTime()), user_id);
        
        // Send room users data to my user
        current_room.people.forEach(people_id => {
            const connection = this.clients[people_id];
            if(people_id != user_id && connection)
            {
                this.sendPrivateMessage(new Message("system", "USER_JOIN", this.world.getUser(people_id).toJSON(), getTime()), user_id);
            } 
        });

        // Send New user info
        this.sendRoomMessage( new Message("system", "USER_JOIN", user.toJSON(), getTime()), user.room, user_id);
        
    },

    onUserDisconnected: function(connection)
    {
        // Notify the server
        console.log("User has left");

        // Get necesary data of the leaving user
        const user_id = connection.user_id;
        const user = this.world.getUser(user_id);
        
        // Delete the connection
        delete this.clients[user_id];
        
        // Update info to the other users
        this.sendRoomMessage( new Message("system", "USER_LEFT", JSON.stringify(user.name), getTime()), user.room, user_id);
    },

    // Message callbacks
    routeMessage: function(message)
    {
        // Prepare the message to be broadcasted
        
        const addressees = message.addressees;
        //if(message.addressees != undefined) delete message.addressees;
        if(message.time == null) message.date = getTime();

        // Eventually, message has passed all checkings and is ready to be sent!

        switch(message.type)
        {
            case "TICK":
                console.log("TICK RECIVED: ", message.content )
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

    onTick: function(message)
    {
        // Necessary information to compute the task
        const sender_id = message.sender;
        const content = message.content;
        room = this.world.getRoom(this.world.users[sender_id].room);

        // Update the WORLD state
        this.world.users[sender_id].target = content.target;
    
        // Send the message to the other users
        // console.log(room.id)
        // console.log(message)
        // console.log(sender_id)
        this.sendRoomMessage(message,room.id,sender_id)
    },

    // NOTI NOTI
    onPrivateMessage: function(message)
    {
        // TODO
    },

    //NOT YET MAI FRIEND
    onPublicMessage: function(message)
    {
        // TODO
    },

    onExit: function(message)
    {
        // Necessary information to compute the task
        const sender_id = message.sender;
        const content = message.content;

        // Dada la exit, encontrar la room
        // const exit = content.exit[1];
        exit = 0;
        var new_room = this.world.getRoom(exit);
        var user = this.world.users[sender_id];
        var last_room = this.world.getRoom(content.room);

        // Update server data from users
        user.room = new_room.id;
        user.position = room.range[0];
        user.target = user.position;

        // Update server data from room
        // Remove the user from last room
        const index = last_room.people.indexOf(sender_id)
        last_room.people.splice(index,1);

        // Add user to new room 
        new_room.people.push(user);

        // Update clients info
        this.OnNewUserEnter(user,sender_id,new_room);

    },

    //MAYBE IN A FUTURE
    onTyping: function(message)
    {
        // TODO
    },

    // Check message
    checkMessage: function(connection, message)
    {
        // Get some vars
        const user_id = connection.user_id;
        const user_current_room = WORLD.getRoom(user.room);

        // Check the sender id and the connection user id matches
        if (message.sender != user_id)
        {
            const message = Message("system", "ERROR", "Eres muy perrito y me la has intentado colar", getTime());
            connection.sendUTF(JSON.stringify(message));
            return "SENDER_ERROR";
        };

        // Check the sender is sending messages to people of the same room
        if(message.addressees != [])
        {
            message.addressees.forEach(addressee => {
                if(!user_current_room.people.includes(addressee))
                {
                    const message = Message("system", "ERROR", "¿A quién le intentas enviar tú un mensaje, perrito?", getTime());
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

    sendRoomMessage: function(message, room_id, id_)
    {
        // Get room
        const room = this.world.getRoom(room_id);

        // Iterate through room people
        console.log("sendRoomMessage");

        for(id of room.people)
        {
            if(id == id_) continue;
            const connection = this.clients[id];
            // In case there is no connection for this id
            if(connection)
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