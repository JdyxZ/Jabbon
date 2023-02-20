

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
        console.log("New ROOM message received: ", message.content);
        MYAPP.current_room = message.content;
    },

    setMyUser: function(message)
    {
        console.log("New YOUR_INFO message received: ", message.content);
        MYAPP.myuser = message.content;
        MYAPP.users.push(MYAPP.myuser);
    },

    onUserJoin: function(message)
    {
        console.log("New USER_JOIN message received: ", message.content);
        console.log(message.content);
        MYAPP.users.push(message.content);
    },

    onUserLeft: function(message)
    {
        console.log("New USER_LEFT message received: ", message.content);
        const usr = MYAPP.users.getObjectIndex("id",message.content);
        MYAPP.users.splice(usr,1);
    },

    onTick: function(message)
    {
        console.log("New TICK message received: ", message.content);
        //Mirar bien el mensaje que recibo
        
        // console.log(message);
        MYAPP.users[MYAPP.getIDByUserID(message.sender)].target = message.content.target;
    },

    // De momento no
    onPrivateMessage: function(message)
    {
        console.log("New PRIVATE message received: ", message.content);
    },

    // De momento no
    onRoomMessage: function(message)
    {
        console.log("New PUBLIC message received: ", message.content);
    },

    // Diria que esta no la usaremos
    onShutDown: function(message)
    {
        console.log("New SHUT DOWN message received: ", message.content);
    },

    // Future implementation
    onTyping: function(message)
    {
        console.log("New TYPING message received: ", message.content);
    },

    onError: function(message)
    {
        console.log("aqui");
        console.log(message);
    },

    // Methods
    sendRoomMessage: function(message)
    {
        // Append addresses to the message
        message.addressees = [];
        // Send message to user
        this.socket.send(JSON.stringify(message));
    },

    sendPrivateMessage: function(message, addressees)
    {
        // Check addressees
        if (!addressees instanceof Array)
        {
            console.error("The addressees of your message must be an array of ids");
            return;
        }

        // Append addresses to the message
        message.addressees = addressees;

        // Send message to user
        this.socket.send(JSON.stringify(message));
    }

}

// Before reloading page close connection
window.onbeforeunload = function() {
    if(CLIENT.socket != null)
    {
        CLIENT.socket.onclose = function () {}; // disable onclose handler first
        CLIENT.socket.close(); // Gracias internet <3
    }
};