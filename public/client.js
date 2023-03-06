

/***************** CLIENT *****************/
var CLIENT =
{
    // Client data
    port: 9014,
    socket: null,
    debug: null,
    
    init: function()
    {
        // New WebSocket instance
        this.socket = new WebSocket(`ws://localhost:${this.port}`);

        // Callbacks
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    },

    // WebSocket callbacks
    onOpen: function()
    {
        console.log("Connecting!");
    },

    onClose: function()
    {
        console.log("Disconnecting!");
    },
    
    onMessage: function(ws_message)
    {
        // Process message
        const message = JSON.parse(ws_message.data);

        switch(message.type)
        {
            case "ROOM":
                this.setRoom(message);
                break;
            case "YOUR_INFO":
                this.setMyUser(message);
                break;
            case "USER_JOIN":
                this.onUserJoin(message);
                break;
            case "USER_LEFT":
                this.onUserLeft(message);
                break;
            case "TICK":
                this.onTick(message);
                break;
            case "PRIVATE":
                this.onPrivateMessage(message);
                break;
            case "PUBLIC":
                this.onRoomMessage(message);
                break;
            case "SHUT_DOWN":
                this.onShutDown(message);
                break;
            case "TYPING":
                this.onTyping(message);
                break;
            case "ERROR":
                this.onError(message);
                break;
        }        
        
    },
    
    // Message callbacks
    setRoom: function(message)
    {
        // Log
        console.log("New ROOM message received\n");
        console.table(message.content);

        // Get data
        const room = message.content;

        // Assign new room
        MYAPP.current_room = room;

        // Set room name into the chat
        room_name.innerText = room.name;
    },

    setMyUser: function(message)
    {
        // Log
        console.log("New YOUR_INFO message received\n");
        console.table(message.content);

        // Assign my user info to my_user
        MYAPP.my_user = message.content;
    },

    onUserJoin: function(message)
    {
        // Log
        console.log("New USER_JOIN message received\n");
        console.table(message.content);

        // Get data
        const users = message.content;

        // Append new users to users
        users.forEach(user => MYAPP.users_obj[user.id] = user);
        MYAPP.users_arr = MYAPP.users_arr.concat(users);

        // Set room people
        setRoomPeople();
    },

    onUserLeft: function(message)
    {
        // Log
        console.log("New USER_LEFT message received\n");
        console.table(message.content);

        // Get data
        const user_id = message.content;
        const index = MYAPP.users_arr.getObjectIndex({id: user_id});

        // Check
        if(index == -1)
        { 
            console.error(`onUserLeft callback --> User id ${user_id} is not in the container`);
            return;  
        }

        // Delete left user from users
        delete MYAPP.users_obj.user_id;
        MYAPP.users_arr.splice(index, 1);

        // Set room people
        setRoomPeople();
    },

    onTick: function(message)
    {
        // Log
        console.log("New TICK message received\n");
        console.table(message.content);

        // Get data
        const sender_id = message.sender;
        const new_target = message.content.target;

        // Check
        if(!MYAPP.users_obj[sender_id])
        {
            console.error(`onTick callback -->The user id ${sender_id} is not registered`);
            return;
        }

        // Set user target
        MYAPP.users_obj[sender_id].target = new_target;
    },


    onPrivateMessage: function(message)
    {
        // Log
        console.log("New PRIVATE message received\n");
        console.table(message.content);
    },


    onRoomMessage: function(message)
    {
        // Log
        console.log("New PUBLIC message received\n");
        console.table(message.content);

        // Get some vars
        const sender_id = message.sender;
        const sender = MYAPP.users_obj[sender_id];
        const content = message.content;
        const time = message.time;
        const user_id = MYAPP.my_user.id;

        // Get layout type
        let layout_type;
        switch(true)
        {
            case last_sender == null:
                layout_type = "new";
                break;
            case last_sender == sender_id:
                layout_type = "concurrent";
                break;
            default:
                layout_type = "new";
                break;
        }

        // Fetch and clone proper message template
        const message_template = layout_type == "new" ? new_user_message_template : concurrent_user_message_template;
        let message_box = message_template.cloneNode(true);

        // Set message contents
        if (layout_type == "new") message_box.get(".message .username").innerText = sender.name;
        message_box.get(".message-content").innerText = content;
        message_box.get(".message-time").innerText = time;

        // Add template to the DOM
        layout_type == "new" ? conversation.appendChild(message_box) : conversation.lastElementChild.appendChild(message_box);

        //Delete template old attributes
        message_box.removeAttribute('id');

        // Show new message
        message_box.show();

        //Update scrollbar focus
        message_box.scrollIntoView();		

        // Update last sender id
        last_sender = sender_id;
    },


    onShutDown: function(message)
    {
        // Log
        console.log("New SHUT DOWN message received\n");
        console.table(message.content);
    },


    onTyping: function(message)
    {
        // Log
        console.log("New TYPING message received\n");
        console.table(message.content);
    },

    onError: function(message)
    {
        // Log
        console.log("New ERROR message received\n");
        console.table(message.content);
    },

    // Methods
    sendRoomMessage: function(message)
    {
        // Send message to user
        this.socket.send(JSON.stringify(message));
    },

    sendPrivateMessage: function(message, addressees)
    {
        // Checkings
        if (isNumber(addressees) || isString(addressees)) addressees = addressees.toArray();    
        else if (!isArray(addressees))
        {
            console.log(`ERROR ---> Invalid input "${addressees}" in function sendPrivateMessage of CLIENT. Message won't be send`);
            return;
        }

        // Append addresses to the message
        message.addressees = addressees;

        // Send message to user
        this.socket.send(JSON.stringify(message));
    }
}

// Before reloading page, close connection with the WebSocket Server
window.onbeforeunload = function() {
    if(CLIENT.socket != null)
    {
        CLIENT.socket.onclose = function () {}; // disable onclose handler first
        CLIENT.socket.close(); // Gracias internet <3
    }
};