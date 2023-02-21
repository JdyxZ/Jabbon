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
    messages_types = ["TICK", "PRIVATE", "PUBLIC", "EXIT", "TYPING"];

    /***************** HTTP SERVER CALLBACKS *****************/

    // Init server
    init: async function(){

        // MySQL Connection
        DATABASE.initConnection();

        // Load world data
        const [status, model] = await DATABASE.fetchModel();

        // Check errors
        if(status == "ERROR")
        {
            console.log(model);
            process.exit();
        }            
        else
        {
            WORLD.init(model.rooms, model.users);
            console.log("*********** MODEL INFO *********** \n");
            console.log(`World data successfully loaded!`);
            console.log(`Number of rooms ${WORLD.num_rooms}`);
            console.log("\n*********** SERVER LOG *********** \n");
        }
    },

    // Ready callback
    onReady: function(port)
    {
        console.log("\n*********** SERVER INFO *********** \n");
        console.log(`Serving with pid ${process.pid}`); // Good practice to know my process pid
        console.log(`Server listening at port ${port}!`);
        console.log("\n");
        this.port = port;
    },

    // Before closing
    onClose: function()
    {
        DATABASE.updateModel(WORLD);
    },

    /***************** WEBSOCKET CALLBACKS *****************/

    onMessage: function(connection, ws_message)
    {
        try {
            // Parse message
            const message = JSON.parse(ws_message.utf8Data);
            
            // Check message
            const result = this.checkMessage(connection, message);
            if (result != "OK") throw result;

            // If there is no send time, append one
            if(message.time == null) message.time = getTime();

            // Eventually, message has passed all checkings and is ready to be sent!
            this.routeMessage(message);
        } 
        // Catch errors
        catch (error) 
        {
            console.log(`ERROR --> Error upon processing received message: ${error}`);
            const message = new Message("system", "ERROR", "Error upon processing your message", getTime());
            connection.sendUTF(JSON.stringify(message));
        }
    },

    onUserConnected: function(connection, user_id)
    {       
        // Get user data
        const user = WORLD.getUser(user_id);

        // Check that user exists
        if(!user)
        {
            console.log(`ERROR --> Invalid user ID ${user_id} in function onUserConnected: User doesn't exist`);
            return;
        }
        
        // Store connection
        connection.user_id = user.id;
        this.clients[user.id] = connection; 
        
        // Send data about the new user
        this.onNewUserToRoom(user.id, "NEW");   

        // Log
        console.log(`EVENT --> User ${user.name} has joined`);
    },

    onUserDisconnected: function(connection)
    {
        // Get user data
        const user_id = connection.user_id;
        const user = WORLD.getUser(user_id);
        
        // Delete the connection
        delete this.clients[user_id];
        
        // Update info to the other users
        const message = new Message("system", "USER_LEFT", JSON.stringify(user.id), getTime());
        this.sendRoomMessage(message, user.room, user_id);

        // Log
        console.log(`EVENT --> User ${user.name} has left`);
    },

    /***************** MESSAGE CHECKING *****************/

    // Check message for security reasons
    checkMessage: function(connection, message)
    {
        // Get some vars
        const user_id = connection.user_id;
        const user = WORLD.getUser(user_id);
        const user_current_room = user.room;
        const public_types = messages_types.clone().remove("PRIVATE");
        const private_types = ["PRIVATE"];

        // Check that the sender is registered in the WORLD
        if(user == undefined)
            return "SENDER_EXISTS_ERROR";

        // Check the sender id and the connection user id matches
        if (message.sender != user_id)
            return "SENDER_MATCH_ERROR";

        // Check the sender is sending a valid type of message 
        if(!messages_types.includes(message.type))
            return "TYPE_MESSAGE_ERROR";

        // Check the sender is coherent with the type of message they are sending
        if(public_types.includes(message.type) && message.addressees != undefined)
            return "PUBLIC_WITH_ADDRESSES_ERROR";
        
        if(private_types.includes(message.type) && message.addressees == undefined)
            return "PRIVATE_WITHOUT_ADDRESSES_ERROR";

        // Check addresses property
        if(private_types.includes(message.type) && !(message.addressees instanceof Array))
            return "ADDRESSES_TYPE_ERROR";

        // Check the sender is sending messages to people of the same room
        if(private_types.includes(message.type))
        {
            message.addressees.forEach(addressee => {
                if(!user_current_room.people.includes(addressee))
                    return "ADDRESSEE_INVALID_ERROR";
            });
        };

        // Output
        return "OK";
    },

    /***************** MESSAGE ROUTING *****************/

    // Message callbacks
    routeMessage: function(message)
    {
        // Route message        
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

    onTick: function(message)
    {
        // Get message data
        const sender_id = message.sender;
        const content = message.content;

        // Get user data
        const user = WORLD.getUser(sender_id);

        // Log
        console.log(`EVENT --> User ${user.name} has sent a TICK message`);

        // Update the WORLD state
        user.target = content.target;
        user.position = content.target[0];
    
        // Send the message to all the people in the room except the user
        this.sendRoomMessage(message, user.room, user.id);
    },

    onPrivateMessage: function(message)
    {
        // Get message data
        const sender_id = message.sender;
        const content = message.content;

        // Get user data
        const user = WORLD.getUser(sender_id);

        // Log
        console.log(`EVENT --> User ${user.name} has sent a PRIVATE message`);

        // Prepare the message to be broadcasted
        const addressees = message.addressees;
        if(message.addressees != undefined) delete message.addressees;

        // TODO
        // TODO: If a sender is sending a private message, check that the addressee is within the fov of the sender.
    },

    onPublicMessage: function(message)
    {
        // Get message data
        const sender_id = message.sender;
        const content = message.content;

        // Get user data
        const user = WORLD.getUser(sender_id);

        // Log
        console.log(`EVENT --> User ${user.name} has sent a PUBLIC message`);

        // TODO
    },

    onExit: function(message)
    {
        // Get message data
        const sender_id = message.sender;
        const content = message.content;

        // Get user data
        const user = WORLD.getUser(sender_id);

        // Get room data
        // const exit = content.exit[1];
        exit = 0;
        var next_room = WORLD.getRoom(exit);
        var previous_room = WORLD.getRoom(content.room);

        // Log
        console.log(`EVENT --> User ${user.name} has sent an EXIT message`);      

        // Update server data from users
        user.room = new_room.id;
        user.position = room.range[0];
        user.target = user.position;

        // Remove the user from last room
        previous_room.people.remove(sender_id);

        // Add user to new room 
        next_room.people.push(user.id);

        // Update clients info
        this.onNewUserToRoom(user.id, "OLD");
    },

    //MAYBE IN A FUTURE
    onTyping: function(message)
    {
        // Get message data
        const sender_id = message.sender;
        const content = message.content;

        // Get user data
        const user = WORLD.getUser(sender_id);

        // Log
        console.log(`EVENT --> User ${user.name} has sent a TYPING message`);

        // TODO
    },

    /***************** MESSAGE DELIVERY *****************/

    sendAllClientsMessage: function(message)
    {
        Object.values(this.clients).forEach(connection => {
            connection.sendUTF(JSON.stringify(message));
        });
    },

    sendRoomMessage: function(message, room_id, users_id)
    {
        // Checkings
        if (!isNaN(users_id) || users_id instanceof String) users_id = users_id.toArray();    
        else if (!users_id instanceof Array)
        {
            console.log(`ERROR ---> Invalid input "${users_id}" in function sendRoomMessage of SERVER. Message won't be send`);
            return;
        }

        // Get room
        const room = WORLD.getRoom(room_id);

        // Iterate through room people
        for(user_id of room.people)
        {
            // Skip users
            if(users_id.contains(user_id))
                continue;

            // Get connection
            const connection = this.clients[user_id];
            if(connection == undefined){
                console.log(`Connection with user id ${addressees} doesn't exist`);
                return;
            } 

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
            return;
        }
        else if (addressee instanceof Array)
        {
            // Iterate through addresses
            for(const addressee of addressees)
            {
                // Get connection
                const connection = this.clients[addressee];
                if(connection == undefined){
                    console.log(`Connection with user id ${addressee} doesn't exist`);
                    continue;
                } 
        
                // Send message to the user
                connection.sendUTF(JSON.stringify(message));
            }  
            return;
        }

        // Notify error
        console.log(`ERROR ---> Invalid addressees "${addressees}" input in function sendMessage`);

    },

    /***************** AUXILIAR METHODS *****************/

    onNewUserToRoom: function(user_id, user_type)
    {
        // Get all data stuff
        let message;
        const user = WORLD.getUser(user_id); 
        const user_room = WORLD.getRoom(user.room);
        const {_, room_people_info} = user_room.getRoomPeopleInfo(user_id);

        // Send to the new user info about their current/new room
        message = new Message("system", "ROOM", JSON.stringify(user_room.toJSON()), getTime());
        this.sendPrivateMessage(message, user_id);

        // Send to the new user its own user data
        message = new Message("system", "YOUR_INFO", JSON.stringify(user.toJSON()), getTime());
        this.sendPrivateMessage(message, user_id);
        
        // Send to the new user info about the people in the current/new room
        message = new Message("system", "USER_JOIN", JSON.stringify(room_people_info), getTime());
        this.sendPrivateMessage(message, user_id);

        // Send to the current/new room users data of the new user
        message = new Message("system", "USER_JOIN", JSON.stringify([user.toJSON()]), getTime());
        this.sendRoomMessage(message, user.room, user_id);
        
        // Check if user has just connected before proceeding 
        if(user_type == "NEW")
            return;
        
        // Notify the users of the old room that the user has left
        message = new Message("system", "USER_LEFT", JSON.stringify(user_id), getTime());        
    }
}

module.exports = SERVER;